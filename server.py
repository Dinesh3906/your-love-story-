import os
import gc
import json
import torch
import base64
from io import BytesIO
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration ---
TEXT_MODEL_NAME = "Qwen/Qwen2.5-3B-Instruct"  # ~3B params, faster, less VRAM
CACHE_DIR = "D:\\your love story\\hf_cache"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

SYSTEM_PROMPT = """You are a narrative engine for an interactive story game.

Your task is to:
1. Write a compelling story segment that follows logically from the Previous Story Summary and resolves the PLAYER'S LATEST CHOICE.
2. Insert a CRITICAL decision point that arises naturally from the current scene.
3. Generate 2–4 unique, meaningful options that offer distinct narrative paths.
4. STOP immediately after presenting the options.
5. NEVER reuse the same options. Every choice must be fresh and context-specific.
6. STRICTURE: Options must be VERY SHORT (max 10 words each).

CRITICAL RULES (NON-NEGOTIABLE)
- Options must NOT be repetitive. Avoid generic "React cautiously" or "Talk more" unless highly specific.
- Each choice should lead the story in a fundamentally different direction.
- Resolve the *immediate* consequences of the previous choice before presenting the next one.
- Do NOT prewrite future events.
- Do NOT resolve the choice yourself.
- Do NOT exceed 200 words before a decision point.
- Options must be concise: "I go to the park" is better than "I decide that it is a good day to go to the park."

OUTPUT FORMAT (STRICT JSON ONLY)
{
  "story": "Result of previous action + current scene. End at a cliffhanger/choice.",
  "mood": "Atmospheric label.",
  "tension": 0-100,
  "trust": 0-100,
  "location_name": "Setting name.",
  "time_of_day": "Time label.",
  "options": [
    {
      "id": "A",
      "text": "Specific action/dialogue (e.g., 'Take her hand and explain everything.')",
      "intent": "romance | tension | honesty | humor | conflict"
    }
  ]
}
"""

class ModelManager:
    def __init__(self):
        self.text_model = None
        self.text_tokenizer = None

    def load_text_model(self):
        if self.text_model is not None:
            return
        
        print(f"Loading TEXT model ({TEXT_MODEL_NAME})...")
        
        quantization_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_use_double_quant=True
        )

        self.text_tokenizer = AutoTokenizer.from_pretrained(
            TEXT_MODEL_NAME, 
            cache_dir=CACHE_DIR, 
            trust_remote_code=True
        )
        try:
            # Explicitly define max memory to help accelerate
            max_memory = {0: "5GiB", "cpu": "12GiB"}
            
            self.text_model = AutoModelForCausalLM.from_pretrained(
                TEXT_MODEL_NAME,
                cache_dir=CACHE_DIR,
                trust_remote_code=True,
                quantization_config=quantization_config,
                device_map="auto",
                max_memory=max_memory,
                low_cpu_mem_usage=True,
                offload_folder="offload"
            )
        except Exception as e:
            # If it's just the dispatch warning, some versions of accelerate throw it as an error
            if "dispatched on the CPU" in str(e):
                print(f"Warning: Model partially offloaded to CPU. Continuing...")
                # Try to load again with a map that might satisfy it or just ignore if it somehow works
                if not hasattr(self, 'text_model') or self.text_model is None:
                    self.text_model = AutoModelForCausalLM.from_pretrained(
                        TEXT_MODEL_NAME,
                        cache_dir=CACHE_DIR,
                        trust_remote_code=True,
                        quantization_config=quantization_config,
                        device_map="balanced",
                        max_memory=max_memory,
                        low_cpu_mem_usage=True,
                        offload_folder="offload"
                    )
            else:
                print(f"Loading error: {e}")
                raise e
        print("Text model loaded.")

manager = ModelManager()

# --- Request Models ---

class PromptRequest(BaseModel):
    summary_of_previous: str
    chosen_option: Optional[Dict] = None # {id, intent, text}

# --- Endpoints ---

@app.post("/generate")
async def generate(request: PromptRequest):
    try:
        manager.load_text_model()
        
        # Build prompt based on strict rules
        user_input_section = ""
        if request.chosen_option:
             user_input_section = f"""
Previous Story Summary: {request.summary_of_previous}
PLAYER'S LATEST CHOICE: "{request.chosen_option.get('text')}" (Intent: {request.chosen_option.get('intent')})

TASK: Continue the story directly from this choice. Resolve the action. Then present 2-4 NEW options. 
REMINDER: Options must be EXTREMELY SHORT (max 10 words).
"""
        else:
            user_input_section = f"""
START NEW STORY.
Initial Premise: {request.summary_of_previous}

TASK: Start the story based on this premise. Then present 2-4 NEW options.
REMINDER: Options must be EXTREMELY SHORT (max 10 words).
"""

        full_prompt = f"""<|im_start|>system
{SYSTEM_PROMPT}<|im_end|>
<|im_start|>user
{user_input_section}<|im_end|>
<|im_start|>assistant
"""
        
        inputs = manager.text_tokenizer(full_prompt, return_tensors="pt").to(DEVICE)
        input_ids_len = inputs.input_ids.shape[-1]
        
        with torch.no_grad():
            outputs = manager.text_model.generate(
                **inputs,
                max_new_tokens=512,  # Optimized for faster response
                temperature=0.8,
                do_sample=True,
                top_p=0.95
            )
            
        generated_text = manager.text_tokenizer.decode(outputs[0][input_ids_len:], skip_special_tokens=True)
        print("RAW MODEL OUTPUT:")
        print(generated_text)
        print("-" * 20)
        
        # Extract the assistant's JSON response using regex
        import re
        
        # Find everything between the last assistant token and the end
        assistant_parts = generated_text.split("<|im_start|>assistant")
        assistant_response = assistant_parts[-1] if assistant_parts else generated_text
        
        # Look for the last { and last } which usually contains the actual response
        json_matches = re.findall(r'(\{.*\})', assistant_response, re.DOTALL)
        
        if json_matches:
            # We want the last one, as the first one might be an echo of the instructions
            raw_response = json_matches[-1].strip()
        else:
            raw_response = assistant_response.strip()

        # Remove single-line comments like // ... from the JSON
        raw_response = re.sub(r'//.*', '', raw_response)

        # Attempt to clean up markdown blocks if present
        if "```json" in raw_response:
            raw_response = raw_response.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_response:
             raw_response = raw_response.split("```")[0].strip()

        try:
            parsed_response = json.loads(raw_response)
            
            return parsed_response

        except json.JSONDecodeError:
            print("JSON Parse Failed. Raw:", raw_response)
            # Fallback (simple parse or error)
            return {"error": "Failed to parse model response", "raw": raw_response}

    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}

@app.get("/health")
async def health():
    return {"status": "ok", "device": DEVICE}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
