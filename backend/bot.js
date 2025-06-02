import supabase from "./supabase.js";
import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

console.log("NODE_ENV:", process.env.NODE_ENV);

// Загружаем переменные окружения
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
  console.log("Загружен .env.development");
} else {
  dotenv.config();
  console.log("Загружен .env");
}

console.log("FRONTEND_URL после загрузки:", process.env.FRONTEND_URL);

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHANNEL = process.env.CHANNEL_USERNAME;

// Настройка URL
const APP_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.FRONTEND_URL || "https://your-production-domain.com";

console.log("APP_URL:", APP_URL);

async function checkSubscription(ctx) {
  try {
    const res = await axios.get(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember`,
      {
        params: {
          chat_id: CHANNEL,
          user_id: ctx.from.id,
        },
      }
    );
    const status = res.data.result.status;
    return ["member", "administrator", "creator"].includes(status);
  } catch (e) {
    console.error("Ошибка при проверке подписки:", e.response?.data || e);
    return false;
  }
}

bot.start(async (ctx) => {
  const isSubscribed = await checkSubscription(ctx);

  if (!isSubscribed) {
    return ctx.replyWithMarkdown(
      `👋 *Привет, ${
        ctx.from.first_name || "друг"
      }!*\n\n🔐 Чтобы получить доступ к платформе, нужно быть подписан(а) на мой канал.\n\n👉 Подпишись: [перейти к каналу](https://t.me/${CHANNEL.replace(
        "@",
        ""
      )})\n\nЗатем вернись сюда и напиши /start ещё раз.`
    );
  }

  const token = uuidv4();
  console.log(`DEBUG: Generated token for user ${ctx.from.id}: ${token}`);

  const { error, data: insertData } = await supabase
    .from("auth_tokens")
    .insert([{ token, user_id: ctx.from.id }]);

  if (error) {
    console.error("Supabase insert error:", error);
    return ctx.reply("❌ Произошла ошибка при генерации ссылки.");
  }

  console.log("DEBUG: Supabase insert result:", insertData);

  const authLink = `${APP_URL}/auth?token=${token}`;
  return ctx.replyWithMarkdown(
    `✅ *Отлично!*\nВот твоя персональная ссылка для входа:\n\n👉 [Войти на платформу](${authLink})\n\n🔥 Увидимся внутри!`
  );
});

bot.launch();
console.log("🚀 Бот запущен");
