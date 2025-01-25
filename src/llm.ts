// @ts-ignore
import {z} from 'zod';
import {clearLIFOMessages} from './memory.js';
import {openai} from './ai.ts';
import {systemPrompt} from './systemPrompt.ts';
import {zodFunction, zodResponseFormat} from 'openai/helpers/zod';
import type {AIMessage} from '../types.ts';

export const runLLM = async ({
    model = `${process.env.AI_MODEL}`,
    messages,
    temperature = 0.1,
    tools
}: {
    messages: AIMessage[]
    temperature?: number
    model?: string
    tools?: { name: string; parameters: z.AnyZodObject }[]
}) => {
    const formattedTools = tools?.map((tool) => zodFunction(tool));
    const response = await openai.chat.completions.create({
        model,
        messages: [{role: 'system', content: systemPrompt}, ...messages],
        temperature,
        tools: formattedTools,
        tool_choice: 'auto',
        parallel_tool_calls: false
    });

    try {
        const result: AIMessage = response.choices[0].message;

        return result;
    } catch (e) {
        console.error('\n\nError parsing response from provider: ', response);
        await clearLIFOMessages(1);
        process.exit(1);
    }
}

export const runApprovalCheck = async (userMessage: string) => {
    const response = await openai.beta.chat.completions.parse({
        model: `${process.env.AI_MODEL}`,
        temperature: 0.1,
        response_format: zodResponseFormat(
            z.object({ approved: z.boolean().describe('Did the user say they approved or not?') }),
            'approval_check'
        ),
        messages: [
            { role: 'system', content: 'Determine if the user approved using the tool. If you are not sure, then it is not approved.' },
            { role: 'user', content: userMessage }
        ]
    });

    return response.choices[0].message.parsed?.approved;
}
