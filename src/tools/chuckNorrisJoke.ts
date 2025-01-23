// @ts-ignore
import {z} from 'zod';
import fetch from 'node-fetch';
import type {ToolFn} from '../../types.ts';

const toolDescription = `
This tool must always be used whenever the user asks or refers to a Chuck Norris joke.
This tool must never be used if the user doesn't specifically asks for a Chuck Norris joke.
It will return a JSON object with the icon, id, url and the joke.
`;

export const chuckNorrisJokeToolDefinition = {
    name: 'chuck_norris_joke',
    description: toolDescription,
    parameters: z.object({})
}

type Args = z.infer<typeof chuckNorrisJokeToolDefinition.parameters>;

export const chuckNorrisJoke: ToolFn<Args, string> = async ({toolArgs}) => {
    const res = await fetch('https://api.chucknorris.io/jokes/random', {
        headers: {
            Accept: 'application/json',
        },
    });

    return (await res.json()).value;
}
