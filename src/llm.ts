// @ts-ignore
import {z} from 'zod';
import {clearLIFOMessages} from './memory.ts';
import {getSummary} from './memory.ts';
import {openai} from './ai.ts';
import {systemPrompt as defaultSystemPrompt} from './systemPrompt.ts';
import {zodFunction, zodResponseFormat} from 'openai/helpers/zod';
import type {AIMessage} from '../types.ts';

export const runLLM = async ({
    model = `${process.env.AI_MODEL}`,
    messages,
    temperature = 0.1,
    tools,
    systemPrompt
}: {
    model?: string
    messages: AIMessage[]
    temperature?: number
    stream?: boolean
    tools?: { name: string; parameters: z.AnyZodObject }[],
    systemPrompt?: string
}) => {
    const formattedTools = tools?.map((tool) => zodFunction(tool));
    const summary = await getSummary();

    const response = await openai.chat.completions.create({
        model,
        messages: [
            {
                role: 'system',
                content: `${systemPrompt || defaultSystemPrompt}. Chat summary so far: ${summary}`
            },
            ...messages
        ],
        temperature,
        stream: false,
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

export const summarizeMessages = async (messages: AIMessage[]) => {
    const response = await runLLM({
        systemPrompt: `
        Summarize the key points of the chat in a concise way that would be helpful as context for future interactions.
        Make it like a play by play of the chat.`,
        messages,
        temperature: 0.3,
    })

    return response.content || ''
}
