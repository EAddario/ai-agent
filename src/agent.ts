// @ts-ignore
import {z} from 'zod';
import type {AIMessage} from "../types.js";
import {addMessages, getMessages, saveToolResponse} from './memory.ts';
import {logMessage, showLoader} from './ui.ts';
import {runApprovalCheck, runLLM} from './llm.ts';
import {toolApprovalRequired, runTool} from './toolRunner.ts';

const handleApprovalFlow = async (
    history: AIMessage[],
    userMessage: string
) => {
    const lastMessage = history[history.length - 1];
    // @ts-ignore
    const toolCall = lastMessage?.tool_calls?.[0];

    if (!toolCall || !await toolApprovalRequired(toolCall))
        return false;

    const loader = showLoader('Processing approval...');
    const approved = await runApprovalCheck(userMessage);

    if (approved) {
        loader.update(`executing tool: ${toolCall.function.name}`);
        const toolResponse = await runTool(toolCall, userMessage);

        loader.update(`done: ${toolCall.function.name}`);
        await saveToolResponse(toolCall.id, toolResponse);
    } else {
        await saveToolResponse(
            toolCall.id,
            `User did not approve ${toolCall.function.name} at this time.`
        )
    }

    loader.stop();

    return true;
}

export const runAgent = async ({
    limit = 1,
    userMessage,
    tools = []
}: {
    limit?: number;
    userMessage: string;
    tools?: { name: string; parameters: z.AnyZodObject }[];
}) => {
    process.on('SIGINT', () => {
        console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
        process.exit(1);
    });

    const history = await getMessages();
    const isApproval = await handleApprovalFlow(history, userMessage);

    if (!isApproval)
        await addMessages([{role: 'user', content: userMessage}]);

    const loader = showLoader('🤔');
    let turns = 0;

    while (true) {
        if (turns++ > limit) {
            loader.stop();
            return getMessages();
        }

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

            if (await toolApprovalRequired(toolCall)) {
                loader.update('Tool requires user\'s approval!');
                loader.stop();
                console.log(`This tool requires your approval before executing. Are you OK proceed?`);
                return getMessages();
            }

            const toolResponse = await runTool(toolCall, userMessage);
            await saveToolResponse(toolCall.id, toolResponse);
            loader.update(`executed: ${toolCall.function.name}`);
        }
    }
}
