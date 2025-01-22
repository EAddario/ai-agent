// @ts-ignore
import { z } from 'zod';
import fetch from 'node-fetch';
import type { ToolFn } from '../../types.ts';

export const chuckNorrisJokeToolDefinition = {
  name: 'chuck_norris_joke',
  description: 'Get a random Chuck Norris joke',
  parameters: z
    .object({})
    .describe('Use this tool to get a random Chuck Norris joke. It will return a JSON object with the icon, id, url and the joke.')
}

type Args = z.infer<typeof chuckNorrisJokeToolDefinition.parameters>;

export const chuckNorrisJoke: ToolFn<Args, string> = async ({ toolArgs }) => {
  const res = await fetch('https://api.chucknorris.io/jokes/random', {
    headers: {
      Accept: 'application/json',
    },
  });

  return (await res.json()).value;
}
