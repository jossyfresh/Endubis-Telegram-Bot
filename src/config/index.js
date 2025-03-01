import dotenv from "dotenv";

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const API_URL = process.env.API_URL;
export const MINI_APP_URL = process.env.MINI_APP_URL;

if (!MINI_APP_URL) {
  console.error("Error: MINI_APP_URL is missing from environment variables.");
  process.exit(1);
}

if (!API_URL) {
  console.error("Error: API_URL is missing from environment variables.");
  process.exit(1);
}

if (!BOT_TOKEN) {
  console.error("Error: BOT_TOKEN is missing from environment variables.");
  process.exit(1);
}
