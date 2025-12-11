import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "schema/schema.js";
const db = drizzle(process.env.DATABASE_URL, { logger: true, schema });

export default db;
