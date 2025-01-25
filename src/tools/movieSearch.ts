// @ts-ignore
import {z} from 'zod';
import {queryMovies} from '../rag/query.js';
import type {ToolFn} from '../../types.ts';

const toolDescription = `
This tool searches for movies and information about them, including title, genre, director, actors, year, running time, rating, number of votes, revenue, and description.
This tool must always be used whenever the user asks or refers to information about movies.
This tool must never be used if the user doesn't specifically asks for information about movies.
`;

export const movieSearchToolDefinition = {
    name: 'movie_search',
    hitlApproval: true,
    description: toolDescription,
    parameters: z.object({
        query: z.string().describe('The search query for finding movies'),
        genre: z.string().optional().describe('Filter movies by genre'),
        director: z.string().optional().describe('Filter movies by director')
    })
}

type Args = z.infer<typeof movieSearchToolDefinition.parameters>;

export const movieSearch: ToolFn<Args, string> = async ({toolArgs}) => {
    const {query, genre, director} = toolArgs;

    const filters = {
        ...(genre && {genre}),
        ...(director && {director})
    }

    let results;
    try {
        results = await queryMovies(query, filters);
    } catch (err) {
        console.error(`\nUnexpected error! Failed to search for movies.\n${err}\n`);
        return 'Error: Failed to search for movies';
    }

    const formattedResults = results.map((result) => ({
        title: result.metadata?.title,
        genre: result.metadata?.genre,
        director: result.metadata?.director,
        actors: result.metadata?.actors,
        year: result.metadata?.year,
        runtime: result.metadata?.runtime,
        rating: result.metadata?.rating,
        votes: result.metadata?.votes,
        revenue: result.metadata?.revenue,
        description: result.data
    }));

    return JSON.stringify(formattedResults, null, 2);
}
