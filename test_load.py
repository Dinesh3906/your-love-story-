import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import sys

MODEL_PATH = r"D:\phi2clean"
print(f"Testing load from {MODEL_PATH}")
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, trust_remote_code=True)
    print("Tokenizer loaded")
    model = AutoModelForCausalLM.from_pretrained(MODEL_PATH, torch_dtype=torch.float32, trust_remote_code=True)
    print("Model loaded")
except Exception as e:
    print(f"FATAL ERROR: {e}")
    sys.exit(1)
