import {JSONFilePreset} from 'lowdb/node';
import { summarizeMessages } from './llm.ts';
import {v4 as uuidv4} from 'uuid';
import type {AIMessage} from '../types.ts';

const messageWindowSize = 5;
const messageMemorySize = 5;

export type MessageWithMetadata = AIMessage & { id: string, createdAt: string }

export const addMetadata = (message: AIMessage): MessageWithMetadata => ({
    ...message,
    id: uuidv4(),
    createdAt: new Date().toISOString()
});

export const removeMetadata = (message: MessageWithMetadata): AIMessage => {
    const {id, createdAt, ...messageWithoutMetadata} = message;

    return messageWithoutMetadata;
}

type Data = {
    summary: string,
    messages: MessageWithMetadata[]
}

const defaultData: Data = {
    summary: '',
    messages: []
}

export const getDb = async () => {

    return await JSONFilePreset<Data>('db.json', defaultData);
}

export const addMessages = async (messages: AIMessage[]) => {
    const db = await getDb();
    db.data.messages.push(...messages.map(addMetadata));

    if (db.data.messages.length % messageMemorySize === 0) {
        const messages = db.data.messages.map(removeMetadata);
        let chat:string[] = [];

        for (let idx = messages.length - 1; idx >= 0; idx--) {

            if (messages[idx].role === 'user' || messages[idx].role === 'assistant') {
                const msg = messages[idx] as {role: 'user' | 'assistant', content: string};

                if (msg.content)
                    chat.push(`${msg.role.toUpperCase()}: ${msg.content}`);
            }

            if (chat.length === messageMemorySize) {
                chat = chat.reverse();
                break;
            }

        }

        const oldestMessages: AIMessage[] = [{ role: 'user', content: chat.join(' ') }]

        db.data.summary = await summarizeMessages(oldestMessages) as string;
    }

    await db.write();
}

export const getMessages = async () => {
    const db = await getDb();
    const messages = db.data.messages.map(removeMetadata);
    const lastMessages = messages.slice(-messageWindowSize);

    if (lastMessages[0]?.role === 'tool') {
        const additionalMessage = messages[messages.length - messageWindowSize + 1];
        if (additionalMessage) {
            return [...[additionalMessage], ...lastMessages]
        }
    }

    return lastMessages;
}

export const getSummary = async () => {
    const db = await getDb();

    return db.data.summary
}

export const saveToolResponse = async (toolCallId: string, toolResponse: string) => {

    return await addMessages([{role: 'tool', content: toolResponse, tool_call_id: toolCallId}]);
}

export const clearLIFOMessages = async (removeLast?: number) => {
    const db = await getDb();
    db.data.messages = db.data.messages.slice(0, -(removeLast ?? 0));
    await db.write();
}

export const resetMemory = async () => {
    const db = await getDb();
    db.data = defaultData;
    await db.write();
}
