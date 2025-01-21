import { redditToolDefinition } from './reddit.ts'
import { dadJokeToolDefinition } from './dadJoke.ts'
import { chuckNorrisJokeToolDefinition } from './chuckNorrisJoke.ts';
import { myIPToolDefinition } from './myIP.ts';
import { myLocationToolDefinition } from './myLocation.ts';

export const tools = [
  redditToolDefinition,
  dadJokeToolDefinition,
  chuckNorrisJokeToolDefinition,
  myIPToolDefinition,
  myLocationToolDefinition
]
