import {
  getAddressByUsername,
  getReferralCode,
  sendTransaction,
} from "../api.js";

export const inlineQueryHandler = (bot) => {
  bot.on("inline_query", async (ctx) => {
    const query = ctx.inlineQuery.query.trim();

    // Extract transaction details: "80/ADA/password/abebe"

    const match = query.match(/^(\d+)\s+(\w+)\s+(.+?)\s+(\w+)$/);

    if (!match) {
      const results = [
        {
          type: "article",
          id: "1",
          title: "Send Format",
          description:
            "Please use the format: amount currency password username",
          input_message_content: {
            message_text: ` Send format. Please use the following format:\n\n\`amount currency password username\`\n\nFor example:\n\`80 ADA password someone\``,
          },
        },
      ];
      return ctx.answerInlineQuery(results);
    }
    const [, amount, currency, password, username] = match;
    const senderId = ctx.inlineQuery.from.id;

    try {
      // Fetch receiver's address using the API
      const addressResponse = await getAddressByUsername(username, currency);

      // If API returns an error, assume user is not found
      if (addressResponse.error) {
        throw new Error("User not found");
      }

      const receiverAddress = addressResponse.address;

      // Log the transaction details
      console.log(
        `📌 Transaction Initiated:\n- Amount: ${amount} ${currency.toUpperCase()}\n- Sender ID: ${senderId}\n- Receiver Address: ${receiverAddress}\n- Password: ${password}`
      );

      // Prepare the confirmation popup
      const results = [
        {
          type: "article",
          id: "1",
          title: "Confirm Transaction",
          description: `Send ${amount} ${currency.toUpperCase()} to ${receiverAddress}?`,
          input_message_content: {
            message_text: `Please confirm the transaction:\n- Amount: ${amount} ${currency.toUpperCase()}\n- Receiver Address: ${receiverAddress}`,
          },
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Confirm",
                  callback_data: `confirm_transaction_${amount}_${currency}_${password}_${username}`,
                },
              ],
            ],
          },
        },
      ];

      return ctx.answerInlineQuery(results);
    } catch (error) {
      console.error("Error processing transaction:", error.message);

      // If the user is not found, generate a referral link
      if (error) {
        try {
          const referralCode = await getReferralCode(senderId);
          const referralLink = `https://t.me/Endubis_test_bot?start=${referralCode}`;

          console.log(`🔗 Referral Link: ${referralLink}`);

          const results = [
            {
              type: "article",
              id: "1",
              title: "User Not Registered",
              description: `ctx.from.username  is trying to send you You Are Not  registered on Endubis Wallet. Share this referral link: ${referralLink}`,
              input_message_content: {
                message_text: `You Are Not  registered on Endubis. Share this referral link: ${referralLink}`,
              },
            },
          ];

          return ctx.answerInlineQuery(results);
        } catch (referralError) {
          console.error("Error fetching referral code:", referralError);

          const results = [
            {
              type: "article",
              id: "3",
              title: "Transaction Failed",
              description: "Transaction failed. Please try again.",
              input_message_content: {
                message_text: "❌ Transaction failed. Please try again.",
              },
            },
          ];

          return ctx.answerInlineQuery(results);
        }
      }

      // Generic failure message
      const results = [
        {
          type: "article",
          id: "3",
          title: "Transaction Failed",
          description: "Transaction failed. Please try again.",
          input_message_content: {
            message_text: "❌ Transaction failed. Please try again.",
          },
        },
      ];

      return ctx.answerInlineQuery(results);
    }
  });

  bot.action(/confirm_transaction_(\d+)_(\w+)_(.+?)_(\w+)/, async (ctx) => {
    const [, amount, currency, password, username] = ctx.match;
    const senderId = ctx.from.id;

    try {
      // Fetch receiver's address using the API
      const addressResponse = await getAddressByUsername(username, currency);

      // If API returns an error, assume user is not found
      if (addressResponse.error) {
        throw new Error("User not found");
      }

      const receiverAddress = addressResponse.address;

      // Normalize the type parameter
      let normalizedType = currency.toUpperCase();
      if (normalizedType === "ADA") {
        normalizedType = "CARDANO";
      }

      // Prepare the transaction data
      const transactionData = {
        senderTelegramId: senderId.toString(),
        type: normalizedType,
        receiverWalletAddress: receiverAddress,
        amount: parseFloat(amount),
        password: password,
      };

      // Call the sendTransaction API
      const transactionResponse = await sendTransaction(transactionData);
      console.log("🚀 API Call Success:", transactionResponse);

      const successMessage = `
        ✅ *Transaction Successful!*
        - *Amount:* ${amount} ${normalizedType}
        - *Sender:* @${ctx.from.username || senderId}
        - *Receiver:* @${username}
        - *Receiver Address:* \`${receiverAddress}\`
        
        Thank you for using our service!
      `;
      await ctx.editMessageText(successMessage);
    } catch (error) {
      console.error("Error processing transaction:", error.message);
      await ctx.editMessageText("❌ Transaction failed. Please try again.");
    }
  });
};
