import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import { bot } from "./bot.js";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3181;

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).send("Endubis bot is running");
});

const WEBHOOK_PATH = `/bot${process.env.BOT_TOKEN}`;
app.use(bot.webhookCallback(WEBHOOK_PATH));

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Bot is running `);
  console.log(`Webhook URL: ${process.env.WEBHOOK_URL}${WEBHOOK_PATH}`);
});
