import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

export const openai = new OpenAI({
    baseURL: process.env.AI_BASE_URL,
    apiKey: process.env.AI_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "https://github.com/EAddario/ai-agent",
        "X-Title": "AI Agent"
    }
});
