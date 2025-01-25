import {Index as UpstashIndex} from '@upstash/vector'

const index = new UpstashIndex({
    url: process.env.UPSTASH_VECTOR_REST_URL as string,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN as string
});

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

export const queryMovies = async (
    query: string,
    filters?: Partial<MovieMetadata>,
    topK: number = 10
) => {
    let filterStr = '';
    if (filters) {
        const filterParts = Object.entries(filters)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${key}='${value}'`);

        if (filterParts.length > 0)
            filterStr = filterParts.join(' AND ');
    }

    return await index.query({
        data: query,
        topK,
        filter: filterStr || undefined,
        includeMetadata: true,
        includeData: true,
    });
}
