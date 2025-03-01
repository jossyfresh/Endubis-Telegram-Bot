import { mainMenu, limitedMenu } from "../keyboards/ui.js";
import { checkUserRegistration } from "../api.js";

export const messageHandler = async (ctx) => {
  const isRegistered = await checkUserRegistration(ctx.from.id);
  if (isRegistered) {
    await ctx.reply("Please choose an option:", mainMenu);
  } else {
    await ctx.reply("Please choose an option:", limitedMenu);
  }
};
