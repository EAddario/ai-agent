import {runEval} from '../evalTools.ts';
import {runLLM} from '../../src/llm.ts';
import {ToolCallMatch} from '../scorers.ts';
import {myLocationToolDefinition} from '../../src/tools/myLocation.ts';

const createToolCallMessage = (toolName: string) => ({
    role: 'assistant',
    tool_calls: [
        {
            type: 'function',
            function: {name: toolName}
        }
    ]
});

runEval('myLocation', {
    task: (input) =>
        runLLM({
            messages: [{role: 'user', content: input}],
            tools: [myLocationToolDefinition]
        }),
    data: [
        {
            input: 'My Location',
            expected: createToolCallMessage(myLocationToolDefinition.name)
        },
        {
            input: 'Tell me my location',
            expected: createToolCallMessage(myLocationToolDefinition.name)
        },
        {
            input: 'Do you know what my location is?',
            expected: createToolCallMessage(myLocationToolDefinition.name)
        },
        {
            input: 'Where am I?',
            expected: createToolCallMessage(myLocationToolDefinition.name)
        }
    ],
    scorers: [ToolCallMatch]
});
