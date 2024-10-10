import { type Config } from 'drizzle-kit';

export default {
    schema: './src/db/schema.ts',
    out: './src/db',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
    },
} satisfies Config;
