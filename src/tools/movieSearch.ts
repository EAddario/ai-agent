// @ts-ignore
import {z} from 'zod';
import {queryMovies} from '../rag/query.js';
import type {ToolFn} from '../../types.ts';

const toolDescription = `
This tool searches for movies and information about them, including title, genre, director, actors, year, running time, rating, number of votes, revenue, and description.
This tool must always be used whenever the user asks or refers to information about movies.
This tool must never be used if the user doesn't specifically asks for information about movies.
This tool must only be used once per user query.
`;

export const movieSearchToolDefinition = {
    name: 'movie_search',
    hitlApproval: true,
    description: toolDescription,
    parameters: z.object({
        query: z.string().describe('The search query for finding movies'),
        genre: z.string().optional().describe('Filter movies by genre only if a genre is provided. Otherwise do not use this filter'),
        director: z.string().optional().describe('Filter movies by director only if a director is provided. Otherwise do not use this filter'),
        year: z.number().optional().describe('Filter movies by year only if a year is provided. Otherwise do not use this filter'),
    })
}

type Args = z.infer<typeof movieSearchToolDefinition.parameters>;

export const movieSearch: ToolFn<Args, string> = async ({toolArgs}) => {
    const {query, genre, director, year} = toolArgs;

    const filters = {
        ...(genre && {genre}),
        ...(director && {director}),
        ...(year && {year})
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
