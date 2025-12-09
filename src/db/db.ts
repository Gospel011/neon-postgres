import { Pool } from "pg";

const { PG_DEV_DATABSE_URL, PG_PROD_DATABSE_URL, NODE_ENV } = process.env;
const connectionString =
  NODE_ENV == "development" ? PG_DEV_DATABSE_URL : PG_PROD_DATABSE_URL;

const db = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default db;
