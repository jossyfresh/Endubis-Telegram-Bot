import { MINI_APP_URL } from "../config/index.js";

export const backButton = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🔙 Back to Menu", callback_data: "back_to_menu" }],
    ],
  },
};

export const mainMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🚀 Open Mini App", web_app: { url: MINI_APP_URL } }],
      [{ text: "📜 Help", callback_data: "help" }],
      [{ text: "📩 Contact Us", callback_data: "contact_us" }],
      [{ text: "🔗 Referral Link", callback_data: "referral" }],
    ],
  },
};

export const limitedMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "📝 Register", web_app: { url: MINI_APP_URL } }],
      [{ text: "📜 Help", callback_data: "help" }],
      [{ text: "📩 Contact Us", callback_data: "contact_us" }],
    ],
  },
};
