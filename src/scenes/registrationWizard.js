import { Scenes, Markup } from "telegraf";
import { registerUser, checkUserRegistration } from "../api.js";
import { backButton, mainMenu } from "../keyboards/ui.js";

export const registrationWizard = new Scenes.WizardScene(
  "registration-wizard",
  async (ctx) => {
    try {
      const isRegistered = await checkUserRegistration(ctx.from.id);
      if (isRegistered) {
        await ctx.reply(
          "You are already registered. Please choose an option from the menu.",
          mainMenu
        );
        return ctx.scene.leave();
      }

      ctx.reply("Please enter your email:");
      ctx.wizard.state.user = {};
      return ctx.wizard.next();
    } catch (error) {
      console.error("Error checking registration:", error);
      await ctx.reply(
        "An error occurred while checking registration. Please try again later."
      );
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    ctx.wizard.state.user.email = ctx.message.text;
    ctx.reply("Please enter your password:");
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.user.password = ctx.message.text;
    ctx.reply(
      "Please select your country:",
      Markup.inlineKeyboard([
        [Markup.button.callback("Ethiopia", "country_Ethiopia")],
        [Markup.button.callback("Kenya", "country_Kenya")],
        [Markup.button.callback("Gambia", "country_Gambia")],
        [Markup.button.callback("Nigeria", "country_Nigeria")],
        [Markup.button.callback("Ghana", "country_Ghana")],
      ])
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    // Handle country selection
    if (ctx.callbackQuery && ctx.callbackQuery.data.startsWith("country_")) {
      ctx.wizard.state.user.country = ctx.callbackQuery.data.split("_")[1];
      await ctx.answerCbQuery(); // Acknowledge the callback query
    } else {
      ctx.reply("Please select a country from the options provided.");
      return;
    }

    ctx.wizard.state.user.telegramId = String(ctx.from.id);
    ctx.wizard.state.user.first_name = ctx.from.first_name;
    ctx.wizard.state.user.last_name = ctx.from.last_name || "";
    ctx.wizard.state.user.username = ctx.from.username || "";
    ctx.wizard.state.user.referralCode = ctx.session.referralCode || "";
    ctx.wizard.state.user.auth_date = Math.floor(Date.now() / 1000);
    ctx.wizard.state.user.hash = "hash";

    try {
      // Simulate registration (replace this with actual API call)
      await registerUser(ctx.wizard.state.user); // Call your API function here

      await ctx.reply("✅ Successfully registered!", backButton);
    } catch (error) {
      console.error("Error during registration:", error);
      await ctx.reply(
        `❌ Registration failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }

    return ctx.scene.leave();
  }
);
