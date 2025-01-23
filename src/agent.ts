// @ts-ignore
import {z} from 'zod';
import {addMessages, getMessages, saveToolResponse} from './memory.ts';
import {logMessage, showLoader} from './ui.ts';
import {runLLM} from './llm.ts';
import {runTool} from './toolRunner.ts';

export const runAgent = async ({
                                   turns = 10,
                                   userMessage,
                                   tools = []
                               }: {
    turns?: number;
    userMessage: string;
    tools?: { name: string; parameters: z.AnyZodObject }[];
}) => {
    await addMessages([{role: 'user', content: userMessage}]);

    const loader = showLoader('🤔');

    while (true) {
        const history = await getMessages();
        const response = await runLLM({messages: history, tools});

        await addMessages([response]);
        logMessage(response);

        if (response.content) {
            loader.stop();
            return getMessages();
        }

        if (response.tool_calls) {
            const toolCall = response.tool_calls[0];
            loader.update(`executing: ${toolCall.function.name}`);

            const toolResponse = await runTool(toolCall, userMessage);
            await saveToolResponse(toolCall.id, toolResponse);

            loader.update(`executed: ${toolCall.function.name}`);
        }
    }
}
