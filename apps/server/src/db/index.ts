import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

const DATABASE_URL = process.env.DATABASE_URL as string;
const NODE_ENV = process.env.NODE_ENV as string;

declare global {
    // eslint-disable-next-line no-unused-vars
    var globalDb: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

if (NODE_ENV === 'production') {
    db = drizzle(postgres(DATABASE_URL, { prepare: true }), { schema });
} else {
    if (!global.globalDb)
        global.globalDb = drizzle(postgres(DATABASE_URL, { prepare: true }), { schema });

    db = global.globalDb;
}

export { db };