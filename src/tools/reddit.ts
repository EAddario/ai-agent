// @ts-ignore
import {z} from 'zod';
import fetch from 'node-fetch';
import type {ToolFn} from '../../types.ts';

const toolDescription = `
This tool must always be used whenever the user asks or refers to Reddit posts.
This tool must never be used if the user doesn't specifically asks for Reddit posts.
It will return a JSON object with the title, link, subreddit name, author, and number of upvotes of each post.
`;

export const redditToolDefinition = {
    name: 'reddit',
    hitlApproval: false,
    description: toolDescription,
    parameters: z.object({})
}

type Args = z.infer<typeof redditToolDefinition.parameters>;

export const reddit: ToolFn<Args, string> = async ({
    // toolArgs,
    // userMessage
}) => {
    const {data} = await fetch('https://www.reddit.com/.json').then((res) =>
        res.json()
    );

    const relevantInfo = data.children.map((child: any) => ({
        title: child.data.title,
        link: child.data.url,
        subreddit: child.data.subreddit_name_prefixed,
        author: child.data.author,
        upvotes: child.data.ups
    }));

    return JSON.stringify(relevantInfo, null, 2);
}
