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
    systemPrompt,
    messages,
    temperature = 0.3,
    tools
}: {
    model?: string
    systemPrompt?: string
    messages: AIMessage[]
    temperature?: number
    stream?: boolean
    tools?: { name: string; parameters: z.AnyZodObject }[],
}) => {
    const formattedTools = tools?.map((tool) => zodFunction(tool));
    const summary = await getSummary();
    let prompt = systemPrompt || `${defaultSystemPrompt}. Chat summary so far: ${summary}`;

    const response = await openai.chat.completions.create({
        model,
        messages: [
            {
                role: 'system',
                content: prompt
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
    const summary = await getSummary();
    const prompt = `The conversation's summary so far is: "${summary}".
        Using the summary and the following messages, please provide a new summary of the key points of the chat.
        The new summary should be concise in way that would be helpful as context for future interactions.`;

    const response = await runLLM({
        systemPrompt: prompt,
        messages,
        temperature: 0.1
    });

    return response.content || '';
}
