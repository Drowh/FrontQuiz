import express from "express";
import crypto from "crypto";
import supabase from "./supabase.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Тестовый роут
router.get("/test", (req, res) => {
  res.json({ message: "API работает!", timestamp: new Date().toISOString() });
});

// ✅ Обрабатываем GET /auth?token=...
router.get("/auth", async (req, res) => {
  const { token } = req.query;
  console.log(`DEBUG GET /auth: token = ${token}`);

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  const { data, error } = await supabase
    .from("auth_tokens")
    .select("user_id")
    .eq("token", token)
    .single();

  if (error || !data) {
    console.error("Token validation error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }

  console.log(`DEBUG GET /auth: Found user_id = ${data.user_id}`);
  return res.status(200).json({ success: true, telegram_id: data.user_id });
});

// ✅ Обрабатываем POST /auth с токеном в теле запроса
router.post("/auth", async (req, res) => {
  const { token } = req.body;
  console.log(`DEBUG POST /auth: token = ${token}`);

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  const { data, error } = await supabase
    .from("auth_tokens")
    .select("user_id")
    .eq("token", token)
    .single();

  if (error || !data) {
    console.error("Token validation error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }

  console.log(`DEBUG POST /auth: Found user_id = ${data.user_id}`);

  // Удаляем использованный токен
  await supabase.from("auth_tokens").delete().eq("token", token);

  return res.status(200).json({ success: true, telegram_id: data.user_id });
});

// ✅ Обрабатываем POST /auth/telegram от Telegram Login Widget
router.post(
  "/auth/telegram",
  express.urlencoded({ extended: true }),
  async (req, res) => {
    const data = req.body;
    const { hash, ...fields } = data;

    // 🧠 Собираем строку по документации Telegram
    const sortedData = Object.keys(fields)
      .sort()
      .map((key) => `${key}=${fields[key]}`)
      .join("\n");

    const secret = crypto
      .createHash("sha256")
      .update(process.env.BOT_TOKEN)
      .digest();

    const hmac = crypto
      .createHmac("sha256", secret)
      .update(sortedData)
      .digest("hex");

    if (hmac !== hash) {
      return res.status(401).send("🚫 Invalid Telegram login signature");
    }

    // 🧪 Telegram проверен — генерируем токен (теперь UUID)
    const token = uuidv4();

    // 💾 Сохраняем token и user_id
    const { error } = await supabase.from("auth_tokens").insert({
      user_id: fields.id,
      token,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).send("❌ Failed to save token");
    }

    // 🔁 Редиректим на фронт с токеном
    return res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
  }
);

export default router;
