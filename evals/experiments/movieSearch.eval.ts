import {runEval} from '../evalTools.ts';
import {runLLM} from '../../src/llm.ts';
import {ToolCallMatch} from '../scorers.ts';
import {movieSearchToolDefinition} from "../../src/tools/movieSearch.js";

const createToolCallMessage = (toolName: string) => ({
    role: 'assistant',
    tool_calls: [
        {
            type: 'function',
            function: {name: toolName}
        }
    ]
});

runEval('movieSearch', {
    task: (input) =>
        runLLM({
            messages: [{role: 'user', content: input}],
            tools: [movieSearchToolDefinition]
        }),
    data: [
        {
            input: 'Search movie',
            expected: createToolCallMessage(movieSearchToolDefinition.name)
        },
        {
            input: 'Can you recommend a few movies directed by Nolan?',
            expected: createToolCallMessage(movieSearchToolDefinition.name)
        },
        {
            input: 'List the top rated Horror movies',
            expected: createToolCallMessage(movieSearchToolDefinition.name)
        },
        {
            input: 'What\'s the name of the movie where a bunch of guys go hunting and trapping ghosts?',
            expected: createToolCallMessage(movieSearchToolDefinition.name)
        }
    ],
    scorers: [ToolCallMatch]
});
