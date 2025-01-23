import {runEval} from '../evalTools.ts';
import {runLLM} from '../../src/llm.ts';
import {ToolCallMatch} from '../scorers.ts';
import {chuckNorrisJokeToolDefinition} from "../../src/tools/chuckNorrisJoke.js";
import {dadJokeToolDefinition} from '../../src/tools/dadJoke.ts';
import {myIPToolDefinition} from '../../src/tools/myIP.ts';
import {myLocationToolDefinition} from '../../src/tools/myLocation.ts';
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

const createContentMessage = (content: string) => ({
    role: 'assistant',
    content: content
});

const allTools = [
    chuckNorrisJokeToolDefinition,
    dadJokeToolDefinition,
    myIPToolDefinition,
    myLocationToolDefinition,
    redditToolDefinition
];

runEval('allTools', {
    task: (input) =>
        runLLM({
            messages: [{role: 'user', content: input}],
            tools: allTools
        }),
    data: [
        {
            input: 'Do you know any jokes?',
            expected: createToolCallMessage(dadJokeToolDefinition.name)
        },
        {
            input: 'Do you know any Dad jokes?',
            expected: createToolCallMessage(dadJokeToolDefinition.name)
        },
        {
            input: 'Do you know any Chuck Norris jokes?',
            expected: createToolCallMessage(chuckNorrisJokeToolDefinition.name)
        },
        {
            input: "What's my IP?",
            expected: createToolCallMessage(myIPToolDefinition.name)
        },
        {
            input: 'In which country am I?',
            expected: createToolCallMessage(myLocationToolDefinition.name)
        },
        {
            input: 'What is the most upvoted post on Reddit?',
            expected: createToolCallMessage(redditToolDefinition.name)
        }
    ],
    scorers: [ToolCallMatch]
});
