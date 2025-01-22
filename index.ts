import dotenv from 'dotenv';
import { runAgent } from './src/agent.ts';
import { tools } from './src/tools/index.js';

dotenv.config();
const userMessage = process.argv[2];

if (!userMessage) {
  console.error('Please provide a message');
  process.exit(1);
}

const messages = await runAgent({ userMessage, tools });
