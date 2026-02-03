import { Env, generateWithGroq, generateWithGemini, generateWithPollinations, buildUserPrompt } from './providers';
import { SYSTEM_PROMPT } from './prompts';

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        // Handle CORS
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                }
            });
        }

        if (request.url.endsWith("/health")) {
            return new Response(JSON.stringify({ status: "ok" }), { headers: { "Content-Type": "application/json" } });
        }

        if (request.method !== "POST") {
            return new Response("Method not allowed", { status: 405 });
        }

        try {
            const reqBody: any = await request.json();
            const userPrompt = buildUserPrompt(reqBody);

            // --- STRATEGY: Key Rotation & Provider Fallback ---

            // 1. Collect all valid keys from Env
            const groqKeys = Object.keys(env).filter(k => k.startsWith('GROQ_API_KEY')).map(k => (env as any)[k]);
            const geminiKeys = Object.keys(env).filter(k => k.startsWith('GEMINI_API_KEY')).map(k => (env as any)[k]);

            let result = null;
            let errors = [];

            // 2. Try Random Groq Key (Fastest)
            if (groqKeys.length > 0) {
                const randomKey = groqKeys[Math.floor(Math.random() * groqKeys.length)];
                try {
                    console.log("Attempting Groq...");
                    result = await generateWithGroq(randomKey, userPrompt, SYSTEM_PROMPT);
                } catch (e: any) {
                    console.error("Groq Failed:", e);
                    errors.push(`Groq: ${e.message}`);
                }
            }

            // 3. Fallback: Try Random Gemini Key (Free Tier High Limit)
            if (!result && geminiKeys.length > 0) {
                const randomKey = geminiKeys[Math.floor(Math.random() * geminiKeys.length)];
                try {
                    console.log("Attempting Gemini...");
                    result = await generateWithGemini(randomKey, userPrompt, SYSTEM_PROMPT);
                } catch (e: any) {
                    console.error("Gemini Failed:", e);
                    errors.push(`Gemini: ${e.message}`);
                }
            }

            // 4. Últimate Fallback: Pollinations AI (No Key)
            if (!result) {
                try {
                    console.log("Attempting Pollinations...");
                    result = await generateWithPollinations(userPrompt, SYSTEM_PROMPT);
                } catch (e: any) {
                    console.error("Pollinations Failed:", e);
                    errors.push(`Pollinations: ${e.message}`);
                    throw new Error("All providers failed. " + JSON.stringify(errors));
                }
            }

            return new Response(JSON.stringify(result), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });

        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message, fallback_mode: true }), {
                status: 500,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        }
    }
};
