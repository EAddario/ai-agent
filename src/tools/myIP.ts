// @ts-ignore
import {z} from 'zod';
import fetch from 'node-fetch';
import type {ToolFn} from '../../types.ts';

export const myIPToolDefinition = {
    name: 'my_ip',
    description: 'Get my public IP address',
    parameters: z
        .object({})
        .describe('Use this tool to get my public IP. It will return a JSON object with the ip, country and two letter ISO country code.')
}

type Args = z.infer<typeof myIPToolDefinition.parameters>;

export const myIP: ToolFn<Args, string> = async ({toolArgs}) => {
    const res = await fetch('https://api.myip.com', {
        headers: {
            Accept: 'application/json'
        }
    });

    return (await res.json()).ip;
}
