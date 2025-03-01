import { Telegraf, Scenes } from "telegraf";
import { BOT_TOKEN } from "./config/index.js";
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

// Start the bot
bot.launch();
// console.log("Bot started!");

export { bot };
