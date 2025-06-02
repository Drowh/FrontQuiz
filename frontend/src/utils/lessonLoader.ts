// src/utils/lessonLoader.ts
import type { Category, Lesson, LessonWithCategory } from "../types/lesson";
import { supabase } from "./supabaseClient";

// Тип для конфигурации категорий
// type CategoryConfig = {
//   file: string;
// };

// Определяем ключи конфигурации как значения типа Category
// const CATEGORIES_CONFIG: Record<Category, CategoryConfig> = {
//   HTML: { file: "/data/lessons/lessonsHTML.json" },
//   CSS: { file: "/data/lessons/lessonsCSS.json" },
//   JavaScript: { file: "/data/lessons/lessonsJS.json" },
//   TypeScript: { file: "/data/lessons/lessonsTS.json" },
//   React: { file: "/data/lessons/lessonsReact.json" },
// };

export async function loadAllLessons(): Promise<LessonWithCategory[]> {
  try {
    const { data: lessons, error } = await supabase
      .from("lessons")
      .select("*")
      .order("category") // Сортируем по категории
      .order("sequence_id"); // Затем по category-specific ID

    if (error) {
      console.error("Ошибка загрузки уроков:", error);
      // Вместо бросания ошибки, вернем пустой массив, чтобы приложение не падало
      return [];
    }

    return lessons.map((lesson) => ({
      ...lesson,
      category: lesson.category as Category,
      completed: false, // предполагаем, что поле completed будет управляться отдельно
    }));
  } catch (error) {
    console.error("Ошибка при загрузке уроков:", error);
    return [];
  }
}

export async function loadLessonsByCategory(
  category: Category
): Promise<Lesson[]> {
  try {
    const { data: lessons, error } = await supabase
      .from("lessons")
      .select("*")
      // Конвертируем входящую категорию в нижний регистр для запроса к Supabase
      .eq("category", category.toLowerCase())
      .order("sequence_id"); // Сортируем по нашему category-specific ID

    if (error) {
      throw new Error(
        `Ошибка загрузки уроков категории ${category}: ${error.message}`
      );
    }

    // Supabase возвращает категорию в нижнем регистре,
    // но тип Lesson не включает поле category.
    // Если компоненты ожидают category, возможно, нужно вернуть LessonWithCategory.
    // Пока возвращаем как Lesson[], как было до этого.
    return lessons;
  } catch (error) {
    console.error(`Ошибка при загрузке уроков категории ${category}:`, error);
    return [];
  }
}

export async function loadLessonById(id: number): Promise<Lesson | null> {
  try {
    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Ошибка загрузки урока ${id}: ${error.message}`);
    }

    return lesson;
  } catch (error) {
    console.error(`Ошибка при загрузке урока ${id}:`, error);
    return null;
  }
}

export async function findLesson(
  category: Category,
  id: number
): Promise<LessonWithCategory | null> {
  try {
    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("category", category)
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Ошибка загрузки урока ${category}-${id}:`, error);
      return null;
    }

    if (!lesson) {
      return null;
    }

    // Supabase возвращает category в нижнем регистре, преобразуем обратно в верхний для соответствия типу
    return {
      ...lesson,
      category: lesson.category.toUpperCase() as Category,
      completed: false, // предполагаем, что поле completed будет управляться отдельно
    };
  } catch (error) {
    console.error(`Ошибка при поиске урока ${category}-${id}:`, error);
    return null;
  }
}

export async function loadUserProgress(telegramId: string) {
  const { data, error } = await supabase
    .from("user_progress")
    .select("lesson_id, category, completed")
    .eq("telegram_id", telegramId);

  if (error) {
    console.error("Ошибка загрузки прогресса:", error);
    return [];
  }

  return data;
}

export async function updateUserProgress(
  telegramId: string,
  lessonId: number,
  category: string,
  completed: boolean
) {
  const { error } = await supabase.from("user_progress").upsert([
    {
      telegram_id: telegramId,
      lesson_id: lessonId,
      category,
      completed,
      updated_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Ошибка при сохранении прогресса:", error);
  }
}
