import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import { bot } from "./bot.js";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).send("Endubis bot is running");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Bot is running `);
});
