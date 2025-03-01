import { backButton, mainMenu, limitedMenu } from "../keyboards/ui.js";
import { getReferralCode, checkUserRegistration } from "../api.js";
import { Markup } from "telegraf";

export const actionHandlers = (bot) => {
  bot.action("help", async (ctx) => {
    const helpMessage = `
ℹ️ *Help Section*

Welcome to the Endubis Telegram Bot! Here you can find information on how to use the bot and its features.

*Main Features:*
1. *Register*: Register yourself to start using the bot's features.
2. *Referral*: Generate and share your referral link to invite others.
3. *Transactions*: Send and receive transactions securely.

*How to Use:*
1. *Register*: Click on the "Register" button to start the registration process.
2. *Referral*: Click on the "Referral" button to generate your unique referral link.
3. *Send Transaction*: Use the inline query format \`amount/currency/password/username\` to initiate a transaction. For example, \`80/ADA/123/abebe\`.
4. *Help*: Click on the "Help" button to view this help message.
5. *Contact Us*: Click on the "Contact Us" button to get our contact information.

*Inline Query Example:*
To send 80 ADA to the user "abebe" with the password "123", type:
\`@YourBotUsername 80/ADA/123/abebe\`

*Contact Us:*
If you have any questions or need further assistance, please contact us at: contact@example.com

Thank you for using the Endubis Telegram Bot!
    `;
    await ctx.editMessageText(helpMessage, {
      parse_mode: "Markdown",
      reply_markup: backButton.reply_markup,
    });
  });

  bot.action("contact_us", async (ctx) => {
    const contactMessage = `
📩 *Contact Us*

If you have any questions or need further assistance, you can reach us through the following channels:

- Email: contact@example.com
- Twitter: [@EndubisSupport](https://twitter.com/EndubisSupport)
- Telegram Support Line: [@EndubisSupportLine](https://t.me/EndubisSupportLine)
- Telegram Support Chat: [@EndubisSupportChat](https://t.me/EndubisSupportChat)

We are here to help you!
    `;
    await ctx.editMessageText(contactMessage, {
      parse_mode: "Markdown",
      reply_markup: backButton.reply_markup,
    });
  });

  bot.action("back_to_menu", async (ctx) => {
    const isRegistered = await checkUserRegistration(ctx.from.id);
    await ctx.editMessageText(
      "🏠 Welcome back! Please choose an option:",
      isRegistered ? mainMenu : limitedMenu
    );
  });

  bot.action("referral", async (ctx) => {
    try {
      const userId = ctx.from.id;
      const referralCode = await getReferralCode(userId);
      if (!referralCode) throw new Error("Failed to generate referral code.");
      const referralLink = `https://t.me/${bot.botInfo.username}?start=${referralCode}`;
      await ctx.editMessageText(
        `🔗 Share this referral link: ${referralLink}`,
        backButton
      );
    } catch (error) {
      console.error("Referral Error:", error);
      await ctx.editMessageText(
        "❌ Failed to generate referral link. Please try again.",
        backButton
      );
    }
  });

  bot.action("register", async (ctx) => {
    const isRegistered = await checkUserRegistration(ctx.from.id);
    if (isRegistered) {
      await ctx.editMessageText(
        "You are already registered. Please choose an option from the menu.",
        mainMenu
      );
    } else {
      await ctx.scene.enter("registration-wizard");
    }
  });
};
