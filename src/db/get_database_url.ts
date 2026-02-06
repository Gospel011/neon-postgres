import "dotenv/config";
export default function getDatabaseUrl() {
  return process.env.NODE_ENV == "development"
    ? process.env.PG_DEV_DATABSE_URL
    : process.env.PG_PROD_DATABSE_URL;
}
