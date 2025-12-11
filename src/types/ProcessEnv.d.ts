namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    NODE_ENV: 'production' | 'development'
    PG_DEV_DATABSE_URL: string;
    PG_PROD_DATABSE_URL: string;
    DATABASE_URL: string;
  }
}
