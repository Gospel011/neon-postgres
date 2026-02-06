import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  dialect: "postgresql",
  out:
    process.env.NODE_ENV == "development"
      ? "./src/drizzle/dev/migrations"
      : "./src/drizzle/prod/migrations",
  schema: ["./dist/schema/*", "./src/drizzle/migrations/schema.ts"],

  migrations: {
    table: "__migrations",
    schema: "public",
  },

  dbCredentials: {
    url: (process.env.NODE_ENV == "development"
      ? process.env.PG_DEV_DATABSE_URL
      : process.env.PG_PROD_DATABSE_URL) as string,
  },

  verbose: true,
  strict: true,
});
