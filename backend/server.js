// server.js
import express from "express";
import authRouter from "./auth.js";
import cors from "cors";
import dotenv from "dotenv";

// Загружаем переменные окружения
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
} else {
  dotenv.config();
}

const app = express();

// Настройка CORS
app.use(
  cors({
    origin: [
      "https://front-quiz-mu.vercel.app",
      "https://teamsforge.ru",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Добавляем заголовки безопасности
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  next();
});

app.use(express.json());
app.use(authRouter);

// Используем PORT из переменных окружения или 8200 по умолчанию
const PORT = process.env.PORT || 8200;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

export default app;
