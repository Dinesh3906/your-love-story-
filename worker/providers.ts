import { SYSTEM_PROMPT } from './prompts';

export interface Env {
    GROQ_API_KEY?: string;
    GEMINI_API_KEY?: string;
    HF_API_KEY?: string;
}

export interface PromptRequest {
    summary_of_previous: string;
    user_gender: string;
    chosen_option?: {
        id: string;
        text: string;
        intent: string;
    };
}

// --- Pollinations AI (No Key) ---
export async function generateWithPollinations(prompt: string, systemPrompt: string): Promise<any> {
    const fullPrompt = `${systemPrompt}\n\nUSER INPUT:\n${prompt}\n\nIMPORTANT: Return ONLY valid JSON.`;

    const response = await fetch(`https://text.pollinations.ai/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            model: 'openai', // Pollinations maps this to best available free model
            jsonMode: true
        })
    });

    if (!response.ok) throw new Error(`Pollinations Status: ${response.status}`);
    const text = await response.text();
    return JSON.parse(text);
}

// --- Groq (Fastest) ---
export async function generateWithGroq(apiKey: string, prompt: string, systemPrompt: string): Promise<any> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) throw new Error(`Groq Status: ${response.status}`);
    const data: any = await response.json();
    return JSON.parse(data.choices[0].message.content);
}

// --- Gemini (Free Tier) ---
export async function generateWithGemini(apiKey: string, prompt: string, systemPrompt: string): Promise<any> {
    // Gemini REST API URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `${systemPrompt}\n\n${prompt}` }]
            }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        })
    });

    if (!response.ok) throw new Error(`Gemini Status: ${response.status}`);
    const data: any = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    return JSON.parse(text);
}

export function buildUserPrompt(request: PromptRequest): string {
    let user_input_section = "";
    if (request.chosen_option) {
        user_input_section = `
Previous Story Summary: ${request.summary_of_previous}
PLAYER'S LATEST CHOICE: "${request.chosen_option.text}" (Intent: ${request.chosen_option.intent})

TASK: Continue the story directly from this choice. Resolve the action. Then present 2-4 NEW options. 
REMINDER: Options must be EXTREMELY SHORT (max 10 words).
`;
    } else {
        user_input_section = `
START NEW STORY.
PLAYER GENDER: ${request.user_gender}
Initial Premise: ${request.summary_of_previous}

TASK: Start the story based on this premise, keeping the PLAYER GENDER in mind. Then present 2-4 NEW options.
REMINDER: Options must be EXTREMELY SHORT (max 10 words).
`;
    }
    user_input_section += `\nREMINDER: The player is ${request.user_gender}. Maintain this perspective.`;
    return user_input_section;
}
