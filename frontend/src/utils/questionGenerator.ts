import type { Question } from "../types/assessment.types";
import { supabase } from "./supabaseClient";

// Функция для получения ID категорий по их именам
async function getCategoryIdsByNames(
  categoryNames: string[]
): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from("quiz_categories")
    .select("id, name")
    .in("name", categoryNames);

  if (error) {
    console.error("Error fetching category IDs:", error);
    return new Map();
  }

  const categoryMap = new Map<string, number>();
  data.forEach((category) => {
    categoryMap.set(category.name, category.id);
  });

  return categoryMap;
}

// Функция для получения случайных вопросов из массива
function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = arr.slice(); // Создаем копию, чтобы не изменять оригинал
  let i = arr.length;
  const min = i - count;
  if (min < 0) {
    // Если запрошено больше вопросов, чем есть
    return shuffleArray(shuffled);
  }
  while (i-- > min) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled.slice(min);
}

// Функция для перемешивания массива (алгоритм Фишера-Йетса)
function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = array.slice(); // Работаем с копией
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Обмен элементов
  }
  return shuffledArray;
}

// Кэш для хранения вопросов
let questionsCache: {
  timestamp: number;
  questions: Question[];
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 минут в миллисекундах

// Функция для получения всех вопросов одним запросом
async function getAllQuestions(): Promise<Question[]> {
  // Проверяем кэш
  if (
    questionsCache &&
    Date.now() - questionsCache.timestamp < CACHE_DURATION
  ) {
    return questionsCache.questions;
  }

  const { data, error } = await supabase
    .from("quiz_questions")
    .select(
      `
      id:sequence_id,
      question:question,
      options:options,
      correct:correct_answer,
      explanation:explanation,
      quiz_categories(name)
    `
    )
    .in("category_id", [1, 2, 3]);

  if (error) {
    console.error("Error fetching questions:", error);
    return [];
  }

  if (!data) return [];

  const questions: Question[] = data.map((item: any) => ({
    id: item.id,
    technology: item.quiz_categories?.name || "",
    challenge: item.question,
    variants: item.options,
    solution: item.correct,
    insight: item.explanation,
  }));

  // Обновляем кэш
  questionsCache = {
    timestamp: Date.now(),
    questions,
  };

  return questions;
}

// Основная функция для генерации теста
export async function generateAssessmentQuestions(): Promise<Question[]> {
  const allQuestions = await getAllQuestions();

  // Группируем вопросы по категориям
  const questionsByCategory = allQuestions.reduce((acc, question) => {
    const category = question.technology.toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  // Выбираем случайные вопросы из каждой категории
  const selectedHtml = getRandomItems(questionsByCategory.html || [], 7);
  const selectedCss = getRandomItems(questionsByCategory.css || [], 7);
  const selectedJavascript = getRandomItems(
    questionsByCategory.javascript || [],
    7
  );

  const allSelectedQuestions = [
    ...selectedHtml,
    ...selectedCss,
    ...selectedJavascript,
  ];

  return shuffleArray(allSelectedQuestions);
}
