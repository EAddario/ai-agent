// @ts-ignore
import {z} from 'zod';
import fetch from 'node-fetch';
import type {ToolFn} from '../../types.ts';

const toolDescription = `
This tool must always be used whenever the user asks or refers to a Dad joke.
This tool must also be used whenever the user asks for a joke without specifing which type.
This tool must also be used whenever the user asks if you know any jokes without specifing which type.
It will return a JSON object with the id, status and joke.
`;

export const dadJokeToolDefinition = {
    name: 'dad_joke',
    description: toolDescription,
    parameters: z.object({})
}

type Args = z.infer<typeof dadJokeToolDefinition.parameters>;

export const dadJoke: ToolFn<Args, string> = async ({toolArgs}) => {
    const res = await fetch('https://icanhazdadjoke.com/', {
        headers: {
            Accept: 'application/json',
        },
    });

    return (await res.json()).joke;
}
