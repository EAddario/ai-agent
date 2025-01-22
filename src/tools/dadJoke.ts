// @ts-ignore
import { z } from 'zod';
import fetch from 'node-fetch';
import type { ToolFn } from '../../types.ts';

export const dadJokeToolDefinition = {
  name: 'dad_joke',
  description: 'Get a random dad joke',
  parameters: z
    .object({})
    .describe('Use this tool to get a random dad joke. It will return a JSON object with the id, status and joke.')
}

type Args = z.infer<typeof dadJokeToolDefinition.parameters>;

export const dadJoke: ToolFn<Args, string> = async ({ toolArgs }) => {
  const res = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json',
    },
  });

  return (await res.json()).joke;
}
