import { Telegraf, Scenes } from "telegraf";
import { BOT_TOKEN, WEBHOOK_URL } from "./config/index.js";
import { sessionMiddleware } from "./middlewares/session.js";
import { registrationWizard } from "./scenes/registrationWizard.js";
import { startHandler } from "./handlers/startHandler.js";
import { messageHandler } from "./handlers/messageHandler.js";
import { actionHandlers } from "./handlers/actionHandlers.js";
import { inlineQueryHandler } from "./handlers/inlineQueryHandler.js";

// Initialize the bot
const bot = new Telegraf(BOT_TOKEN);

// Initialize session middleware
bot.use(sessionMiddleware);

// Initialize scenes
const stage = new Scenes.Stage([registrationWizard]);
bot.use(stage.middleware());

// Start command with referral handling
bot.start(startHandler);

// Message handler
bot.on("message", messageHandler);

// Action handlers
actionHandlers(bot);

// Inline query handler
inlineQueryHandler(bot);


if (WEBHOOK_URL) {
    const WEBHOOK_PATH = `/bot${BOT_TOKEN}`;
    bot.telegram.setWebhook(`${WEBHOOK_URL}${WEBHOOK_PATH}`);
    console.log(`Webhook set to: ${WEBHOOK_URL}${WEBHOOK_PATH}`);
  } else {
    console.error("WEBHOOK_URL is not defined in the environment variables.");
  }

// console.log("Bot started!");

export { bot };
