// @ts-ignore
import {z} from 'zod';
import fetch from 'node-fetch';
import type {ToolFn} from '../../types.ts';

const toolDescription = `
This tool must always be used whenever the user asks or refers to their physical or geographical location.
This tool must never be used if the user doesn't specifically asks for their location.
It will return a JSON object with the ip, country and two letter ISO country code.
`;

export const myLocationToolDefinition = {
    name: 'my_location',
    description: toolDescription,
    parameters: z.object({})
}

type Args = z.infer<typeof myLocationToolDefinition.parameters>;

export const myLocation: ToolFn<Args, string> = async ({toolArgs}) => {
    const res = await fetch('https://api.myip.com', {
        headers: {
            Accept: 'application/json',
        }
    });

    return (await res.json()).country;
}
