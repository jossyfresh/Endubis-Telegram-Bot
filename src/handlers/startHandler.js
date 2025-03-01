import { mainMenu, limitedMenu } from "../keyboards/ui.js";
import { checkUserRegistration } from "../api.js";

export const startHandler = async (ctx) => {
  try {
    const args = ctx.message.text.split(" ");
    if (args.length > 1) {
      ctx.session.referralCode = args[1]; // Store referral code in session
      // Automatically trigger registration
      await ctx.scene.enter("registration-wizard");
    } else {
      const isRegistered = await checkUserRegistration(ctx.from.id);
      if (isRegistered) {
        await ctx.reply("Welcome! Please choose an option:", mainMenu);
      } else {
        await ctx.reply("Welcome! Please choose an option:", limitedMenu);
      }
    }
  } catch (error) {
    console.error("Error in /start:", error);
    await ctx.reply("An error occurred. Please try again later.");
  }
};
