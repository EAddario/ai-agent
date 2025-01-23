import {runEval} from '../evalTools.ts';
import {runLLM} from '../../src/llm.ts';
import {ToolCallMatch} from '../scorers.ts';
import {redditToolDefinition} from '../../src/tools/reddit.ts';

const createToolCallMessage = (toolName: string) => ({
    role: 'assistant',
    tool_calls: [
        {
            type: 'function',
            function: {name: toolName}
        }
    ]
});

runEval('Reddit', {
    task: (input) =>
        runLLM({
            messages: [{role: 'user', content: input}],
            tools: [redditToolDefinition]
        }),
    data: [
        {
            input: 'Reddit',
            expected: createToolCallMessage(redditToolDefinition.name)
        },
        {
            input: 'Anything interesting on Reddit?',
            expected: createToolCallMessage(redditToolDefinition.name)
        },
        {
            input: 'Give me a summary of Reddit',
            expected: createToolCallMessage(redditToolDefinition.name)
        },
        {
            input: 'What are the top 5 posts on Reddit?',
            expected: createToolCallMessage(redditToolDefinition.name)
        }
    ],
    scorers: [ToolCallMatch]
});
