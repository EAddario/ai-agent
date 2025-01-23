import type OpenAI from 'openai';
import {chuckNorrisJoke} from './tools/chuckNorrisJoke.ts';
import {dadJoke} from './tools/dadJoke.ts';
import {myIP} from './tools/myIP.ts';
import {myLocation} from './tools/myLocation.ts';
import {reddit} from './tools/reddit.ts';

export const runTool = async (
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
    userMessage: string
) => {
    const input = {userMessage, toolArgs: JSON.parse(toolCall.function.arguments)}

    switch (toolCall.function.name) {
        case 'chuck_norris_joke':
            return chuckNorrisJoke(input);

        case 'dad_joke':
            return dadJoke(input);

        case 'my_ip':
            return myIP(input);

        case 'my_location':
            return myLocation(input);

        case 'reddit':
            return reddit(input);

        default:
            throw new Error(`Unknown tool: ${toolCall.function.name}`);
    }
}
