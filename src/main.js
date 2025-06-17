import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { code } from "telegraf/format";
import config from "config";
import { ogg } from "./ogg.js";
import { openai } from "./openai.js";

console.log(config.get("TEST_ENV"));

const INITIAL_SESSION = {
  messages: [],
};

const bot = new Telegraf(config.get("TELEGRAMM_TOKEN"));

bot.use(session());

bot.command("new", async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply("Жду вашего голосового или текстового сообщения");
});

bot.command("start", async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply("Жду вашего голосового или текстового сообщения");
});


// bot.on(message("text"), async (ctx) => {
//   ctx.session ??= INITIAL_SESSION;
//   try {
//     await ctx.reply(code("Cообщение принял. Жду ответ от сервера..."));

//     ctx.session.messages.push({ role: openai.roles.USER, content: ctx.message.text });

//     const response = await openai.chat(ctx.session.messages);
//     if (!response?.content) throw new Error("Нет ответа от модели");

//     ctx.session.messages.push({ role: openai.roles.ASSISTANT, content: response.content });

//     await ctx.reply(response.content);
//   } catch (e) {
//     console.log(`Error while text message`, e.message);
//     await ctx.reply("Произошла ошибка при обработке текста.");
//   }
// });
// 
// 
// 
// 
// 
// 

bot.on(message("text"), async (ctx) => {
  ctx.session ??= { messages: [], isProcessing: false };

  if (ctx.session.isProcessing) {
    return ctx.reply("Пожалуйста, дождитесь ответа на предыдущее сообщение.");
  }

  ctx.session.isProcessing = true;

  try {
    await ctx.reply("Сообщение принял. Жду ответ от сервера...");
    await ctx.sendChatAction("typing"); // Показываем «печатает»

    ctx.session.messages.push({
      role: openai.roles.USER, content: ctx.message.text
    });

    const response = await openai.chat(ctx.session.messages);
    if (!response?.content) throw new Error("Нет ответа от модели");

    ctx.session.messages.push({
      role: openai.roles.ASSISTANT,
      content: response.content,
    });

    await ctx.reply(response.content);
  } catch (e) {
    console.log("Error while text message", e.message);
    await ctx.reply("Произошла ошибка при обработке текста.");
  } finally {
    ctx.session.isProcessing = false;
  }
});



bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));


