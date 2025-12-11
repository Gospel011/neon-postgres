import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./src/drizzle/migrations",
  schema: ["./src/schema/*", "./src/drizzle/migrations/schema.ts"],

  migrations: {
    table: "__migrations",
    schema: "public",
  },

  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },

  verbose: true,
  strict: true,
});
