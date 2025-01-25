import type OpenAI from 'openai';
import {chuckNorrisJoke, chuckNorrisJokeToolDefinition} from './tools/chuckNorrisJoke.ts';
import {dadJoke, dadJokeToolDefinition} from './tools/dadJoke.ts';
import {movieSearch, movieSearchToolDefinition} from './tools/movieSearch.ts';
import {myIP, myIPToolDefinition} from './tools/myIP.ts';
import {myLocation, myLocationToolDefinition} from './tools/myLocation.ts';
import {reddit, redditToolDefinition} from './tools/reddit.ts';

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

        case 'movie_search':
            return movieSearch(input);

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

export const toolApprovalRequired = async (
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall
) => {

    switch (toolCall.function.name) {
        case 'chuck_norris_joke':
            return chuckNorrisJokeToolDefinition.hitlApproval;

        case 'dad_joke':
            return dadJokeToolDefinition.hitlApproval;

        case 'movie_search':
                return movieSearchToolDefinition.hitlApproval;

        case 'my_ip':
            return myIPToolDefinition.hitlApproval;

        case 'my_location':
            return myLocationToolDefinition.hitlApproval;

        case 'reddit':
            return redditToolDefinition.hitlApproval;

        default:
            throw new Error(`Unknown tool: ${toolCall.function.name}`);
    }
}
