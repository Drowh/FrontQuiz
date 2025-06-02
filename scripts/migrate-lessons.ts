import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
import { Category, Lesson } from "../frontend/src/types/lesson";

// Конфигурация Supabase
console.log("Environment variables:", {
  url: process.env.VITE_SUPABASE_URL,
  anonKey: process.env.VITE_SUPABASE_ANON_KEY,
  serviceKey: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? "exists" : "missing",
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Конфигурация файлов
const FILE_NAMES: Record<Category, string> = {
  HTML: "lessonsHTML.json",
  CSS: "lessonsCSS.json",
  JavaScript: "lessonsJS.json",
  TypeScript: "lessonsTS.json",
};

const CATEGORIES: Category[] = ["HTML", "CSS", "JavaScript", "TypeScript"];
const DATA_DIR = path.join(process.cwd(), "frontend/public/data/lessons");

async function migrateLessons() {
  console.log("Starting migration...");

  for (const category of CATEGORIES) {
    const fileName = FILE_NAMES[category];
    const filePath = path.join(DATA_DIR, fileName);

    try {
      // Проверяем существование файла
      try {
        await fs.access(filePath);
      } catch {
        console.log(`Skipping ${category}: file ${fileName} not found`);
        continue;
      }

      // Чтение JSON-файла
      const fileContent = await fs.readFile(filePath, "utf-8");
      if (!fileContent.trim()) {
        console.log(`Skipping ${category}: file ${fileName} is empty`);
        continue;
      }

      const lessons: Lesson[] = JSON.parse(fileContent);

      // Проверка на дубликаты по original_id
      const uniqueLessons = lessons.filter(
        (lesson, index, self) =>
          index === self.findIndex((l) => l.id === lesson.id)
      );

      if (uniqueLessons.length !== lessons.length) {
        console.log(
          `Found ${
            lessons.length - uniqueLessons.length
          } duplicate lessons in ${category}`
        );
      }

      if (!uniqueLessons.length) {
        console.log(`Skipping ${category}: no lessons found in ${fileName}`);
        continue;
      }

      console.log(`Processing ${category} lessons...`);

      // Вставка уроков в Supabase
      // Используем insert вместо upsert, так как id теперь генерируется базой
      const { error } = await supabase.from("lessons").insert(
        uniqueLessons.map((lesson) => ({
          sequence_id: lesson.id, // Используем исходный id как sequence_id
          category: category,
          title: lesson.title,
          motivation: lesson.motivation,
          blocks: lesson.blocks,
        }))
      );

      if (error) {
        console.error(`Error migrating ${category} lessons:`, error);
      } else {
        console.log(`Completed ${category} migration`);
      }
    } catch (error) {
      console.error(`Error processing ${category}:`, error);
    }
  }

  console.log("Migration completed");
}

// Запуск миграции
migrateLessons().catch(console.error);
