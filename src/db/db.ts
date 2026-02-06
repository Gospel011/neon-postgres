import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "schema/schema.js";
import getDatabaseUrl from "./get_database_url.js";
import logger from "@/lib/logger.js";
const dbUrl = getDatabaseUrl();

const db = drizzle(dbUrl, { logger: true, schema });

export default db;
