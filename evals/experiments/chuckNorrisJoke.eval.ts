import {runEval} from '../evalTools.ts';
import {runLLM} from '../../src/llm.ts';
import {ToolCallMatch} from '../scorers.ts';
import {chuckNorrisJokeToolDefinition} from "../../src/tools/chuckNorrisJoke.js";

const createToolCallMessage = (toolName: string) => ({
    role: 'assistant',
    tool_calls: [
        {
            type: 'function',
            function: {name: toolName}
        }
    ]
});

runEval('chuckNorrisJoke', {
    task: (input) =>
        runLLM({
            messages: [{role: 'user', content: input}],
            tools: [chuckNorrisJokeToolDefinition]
        }),
    data: [
        {
            input: 'Chuck Norris jokes',
            expected: createToolCallMessage(chuckNorrisJokeToolDefinition.name)
        },
        {
            input: 'Tell me a Chuck Norris joke',
            expected: createToolCallMessage(chuckNorrisJokeToolDefinition.name)
        },
        {
            input: 'Do you know any Chuck Norris jokes?',
            expected: createToolCallMessage(chuckNorrisJokeToolDefinition.name)
        },
        {
            input: 'How about a Chuck Norris joke?',
            expected: createToolCallMessage(chuckNorrisJokeToolDefinition.name)
        }
    ],
    scorers: [ToolCallMatch]
});
