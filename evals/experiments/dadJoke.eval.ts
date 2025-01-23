import {runEval} from '../evalTools.ts';
import {runLLM} from '../../src/llm.ts';
import {ToolCallMatch} from '../scorers.ts';
import {dadJokeToolDefinition} from '../../src/tools/dadJoke.ts';

const createToolCallMessage = (toolName: string) => ({
    role: 'assistant',
    tool_calls: [
        {
            type: 'function',
            function: {name: toolName}
        }
    ]
});

runEval('dadJoke', {
    task: (input) =>
        runLLM({
            messages: [{role: 'user', content: input}],
            tools: [dadJokeToolDefinition]
        }),
    data: [
        {
            input: 'Dad jokes',
            expected: createToolCallMessage(dadJokeToolDefinition.name)
        },
        {
            input: 'Tell me a Dad joke',
            expected: createToolCallMessage(dadJokeToolDefinition.name)
        },
        {
            input: 'Do you know any Dad jokes?',
            expected: createToolCallMessage(dadJokeToolDefinition.name)
        },
        {
            input: 'How about a Dad joke?',
            expected: createToolCallMessage(dadJokeToolDefinition.name)
        }
    ],
    scorers: [ToolCallMatch]
});
