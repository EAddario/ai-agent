# AI Agent

AI Agent is proof of concept for autonomous agentic AI built with TypeScript. It integrates multiple tools such as fetching Reddit posts, telling jokes, searching for movies, and retrieving user-specific information like IP address and location. The AI agent processes user inputs, and decides to use the appropriate tool based on the context.

## Features

- **Natural Language Processing:** Understands and responds to user queries using the chosen AI model.
- **Integrated Tools:**
  - **Reddit Fetching:** Retrieves top posts from Reddit.
  - **Joke Telling:** Provides Dad jokes and Chuck Norris jokes.
  - **Movie Search:** Searches for movies based on various filters.
  - **User Information:** Fetches user's IP address and geographical location.
- **Extensible Architecture:** Easily add or modify tools to extend functionality.
- **Memory Management:** Maintains conversation history and summarizes past interactions to preserve context size.
- **Approval Workflow:** Ensures user consent before executing certain tools.

## Prerequisites

- **Node.js:** Version 16.x or higher
- **npm:** Package manager for installing dependencies
- **Upstash Account:** For vector indexing (optional, required only for movie search functionality). If you'd like to use a different vector database ([Milvus](https://github.com/milvus-io/milvus) or [Weaviate](https://github.com/weaviate/weaviate) are excellent choices), please modify `./src/rag/query.ts` and `./src/rag/ingest.ts`.
- **AI Provider API Key:** An API Key from an OpenAI compatible provider (e.g. OpenRouter, OpenAI, etc.) is required. The chosen AI model **must** support tool/function calls. For example, [watt-ai/watt-tool-70B](https://huggingface.co/watt-ai/watt-tool-70B), OpenAI's [ChatGPT o4](https://openai.com/index/gpt-4o-system-card/), [Gemini 2.0 Pro](https://deepmind.google/technologies/gemini/pro/).

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/EAddario/ai-agent.git
   cd ai-agent
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

## Configuration

1. **Environment Variables**

   Create a `.env` file in the root directory and configure the following variables:

   ```env
   # OpenAI Configuration
   AI_API_KEY=your-api-key
   AI_BASE_URL=https://api.openai.com/v1
   AI_MODEL=openai/gpt-4
   ```

2. The movie tool uses Retrieval-Augmented Generation, and a valid [Upstash](https://upstash.com/) account is required. Once your have configured the vector database (instructions below), please add the endpoint URL and TOKEN to your `.env` file:

   ```env
   UPSTASH_VECTOR_REST_URL=https://your-upstash-url
   UPSTASH_VECTOR_REST_TOKEN=your-upstash-token
   ```
   Instructions how to set up the vector database are beyond the scope of this README, but a guide is available at [Upstash: Getting Sterated](https://upstash.com/docs/vector/overall/getstarted). Once the database is configured, please execute `npm run ingest` to populate it with the movie data.
   
## Usage

Run the AI Agent by providing a message as a command-line argument. The agent will process the input, utilize the necessary tools, and provide a response. A record of all interactions is stored in `db.json`

```bash
npm start "<user message>"
```

### Example
(using google/gemini-2.0-flash-lite-preview-02-05:free)

```bash
npm start "Hi, how are you? What's your name?"
```
```text
⠧ 🤔
[ASSISTANT]
I'm doing well, thank you! My name is Hal. How can I help you today?
```
```bash
 npm start "Nice meeting you, Hal! My name is Ed"
```
```text
⠴ 🤔
[ASSISTANT]
It's nice to meet you too, Ed! How can I assist you today?
```
```bash
npm start "What can you do for me?"
```
```text
⠦ 🤔
[ASSISTANT]
I can help you with a variety of tasks! For example, I can tell you a joke, search for movies,
provide information about Reddit posts, or even find your IP address or location.
Just let me know what you need!
```
```bash
npm start "Can you tell me a Dad joke, please?"
```
```text
⠙ 🤔
[ASSISTANT]
dad_joke

⠧ executed: dad_joke

[ASSISTANT]
Here's a Dad joke for you: Today at the bank, an old lady asked me to check her balance...
So I pushed her over.
```
```bash
npm start "What information do you have about the movie The Man Who Knew Infinity?"
```
```text
⠴ 🤔
[ASSISTANT]
movie_search

This tool requires your approval before executing. Are you OK proceed?
```
```bash
npm start "Yes, go ahead"
```
```text
⠴ 🤔
[ASSISTANT]
The movie "The Man Who Knew Infinity" is a 2015 biographical drama with a rating of 7.2.
It stars Dev Patel and Jeremy Irons, and is about the life of the Indian mathematician
Srinivasa Ramanujan.
```
```bash
npm start "Thank you, that will be all for now"
```
```text
⠹ 🤔
[ASSISTANT]
You're welcome! If you have any more questions in the future, feel free to ask.
```

## Available Tools

The AI Agent integrates the following tools to enhance its capabilities:

1. **Reddit Tool**
   - **Description:** Fetches top posts from Reddit whenever the user inquires about Reddit content.
   - **Usage Trigger:** References to Reddit posts in the user message.
   - **Output:** JSON object containing the title, link, subreddit name, author, and upvotes of each post.

2. **Dad Joke Tool**
   - **Description:** Provides Dad jokes upon user request.
   - **Usage Trigger:** Queries asking for jokes without specifying the type or directly requesting Dad jokes.
   - **Output:** A random Dad joke as a string.

3. **Chuck Norris Joke Tool**
   - **Description:** Delivers Chuck Norris jokes when specifically requested.
   - **Usage Trigger:** Queries explicitly asking for Chuck Norris jokes.
   - **Output:** A random Chuck Norris joke as a string.

4. **Movie Search Tool**
   - **Description:** Searches for movies based on user-specified criteria such as genre, director, or year.
   - **Usage Trigger:** Inquiries about movie information.
   - **Output:** JSON array of movies matching the search criteria, including details like title, genre, director, actors, year, runtime, rating, votes, revenue, and a description.

5. **My IP Tool**
   - **Description:** Retrieves the user's public IP address.
   - **Usage Trigger:** Direct requests for the IP address.
   - **Output:** JSON object containing the IP address.

6. **My Location Tool**
   - **Description:** Provides the user's geographical location based on their IP address.
   - **Usage Trigger:** Direct inquiries about the user's location.
   - **Output:** JSON object containing the country name and two-letter ISO country code.
