import 'dotenv/config';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import {Index as UpstashIndex} from '@upstash/vector';
import {parse} from 'csv-parse/sync';

type MovieMetadata = {
    title?: string;
    genre?: string;
    director?: string;
    actors?: string;
    year?: number;
    runtime?: number;
    rating?: number;
    votes?:number;
    revenue?: number;
}

const index = new UpstashIndex({
    url: process.env.UPSTASH_VECTOR_REST_URL as string,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN as string
});

export async function indexMovieData() {
    const spinner = ora('Reading movie data...').start();

    const csvPath = path.join(process.cwd(), './src/rag/imdb_movie_dataset.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    const movies = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
    });

    spinner.text = 'Starting vector indexing...';

    for (const movie of movies) {
        spinner.text = `Indexing movie ${movie.Rank}:  ${movie.Title}`;
        const text = `${movie.Title}. ${movie.Genre}. ${movie.Year}. ${movie.Description}`;

        const movieMetadata: MovieMetadata = {
            title: movie.Title,
            genre: movie.Genre,
            director: movie.Director,
            actors: movie.Actors,
            year: Number(movie.Year),
            runtime: Number(movie.Runtime),
            rating: Number(movie.Rating),
            votes: Number(movie.Votes),
            revenue: Number(movie.Revenue)
        }

        try {
            await index.upsert({
                id: movie.Rank,
                data: text,
                metadata: movieMetadata
            });
        } catch (err) {
            spinner.fail(`Error indexing movie ${movie.Rank}: ${movie.Title}`);
            console.error(err);
        }
    }

    spinner.succeed('Finished indexing movie data');
}

indexMovieData()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(`\nUnexpected error! Process terminating.\n${err.message}\n`);
        process.exit(1);
    });
