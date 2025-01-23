// @ts-ignore
import {z} from 'zod';
import fetch from 'node-fetch';
import type {ToolFn} from '../../types.ts';

export const myLocationToolDefinition = {
    name: 'my_location',
    description: 'Get my location',
    parameters: z
        .object({})
        .describe('Use this tool to get my location. It will return a JSON object with the ip, country and two letter ISO country code.')
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
