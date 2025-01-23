import {runEval} from '../evalTools.ts';
import {runLLM} from '../../src/llm.ts';
import {ToolCallMatch} from '../scorers.ts';
import {myIPToolDefinition} from '../../src/tools/myIP.ts';

const createToolCallMessage = (toolName: string) => ({
    role: 'assistant',
    tool_calls: [
        {
            type: 'function',
            function: {name: toolName}
        }
    ]
});

runEval('myIP', {
    task: (input) =>
        runLLM({
            messages: [{role: 'user', content: input}],
            tools: [myIPToolDefinition]
        }),
    data: [
        {
            input: 'My IP address',
            expected: createToolCallMessage(myIPToolDefinition.name)
        },
        {
            input: 'Tell me my IP',
            expected: createToolCallMessage(myIPToolDefinition.name)
        },
        {
            input: 'Do you know what my IP address is?',
            expected: createToolCallMessage(myIPToolDefinition.name)
        },
        {
            input: 'What is my Internet Protocol number?',
            expected: createToolCallMessage(myIPToolDefinition.name)
        }
    ],
    scorers: [ToolCallMatch]
});
