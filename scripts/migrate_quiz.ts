import dotenv from "dotenv";
dotenv.config({ path: "frontend/.env.local" });

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Загрузка переменных окружения
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase credentials");
}

// Инициализация клиента Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizData {
  quiz: {
    html: QuizQuestion[];
    css: QuizQuestion[];
    javascript: QuizQuestion[];
  };
}

async function migrateQuiz() {
  try {
    // Чтение JSON файла
    const quizPath = path.join(
      process.cwd(),
      "frontend",
      "public",
      "quiz.json"
    );
    const quizData: QuizData = JSON.parse(fs.readFileSync(quizPath, "utf-8"));

    // Получение категорий из базы данных
    const { data: categories, error: categoriesError } = await supabase
      .from("quiz_categories")
      .select("id, name");

    if (categoriesError) throw categoriesError;

    const categoryMap = new Map(categories.map((cat) => [cat.name, cat.id]));

    // Миграция вопросов для каждой категории
    for (const [category, questions] of Object.entries(quizData.quiz)) {
      const categoryId = categoryMap.get(category);
      if (!categoryId) {
        console.error(`Category ${category} not found in database`);
        continue;
      }

      // Подготовка данных для вставки
      const questionsToInsert = questions.map((q) => ({
        category_id: categoryId,
        sequence_id: q.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correct,
        explanation: q.explanation,
      }));

      // Вставка вопросов
      const { error: insertError } = await supabase
        .from("quiz_questions")
        .upsert(questionsToInsert, {
          onConflict: "category_id,sequence_id",
        });

      if (insertError) {
        console.error(
          `Error inserting questions for ${category}:`,
          insertError
        );
      } else {
        console.log(
          `Successfully migrated ${questions.length} questions for ${category}`
        );
      }
    }

    console.log("Quiz migration completed successfully");
  } catch (error) {
    console.error("Error during quiz migration:", error);
    process.exit(1);
  }
}

// Запуск миграции
migrateQuiz();
