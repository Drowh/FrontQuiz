// src/types/lesson.ts
export type Category = "HTML" | "CSS" | "JavaScript" | "TypeScript";

// Базовый тип для всех блоков урока
export type LessonBlock = {
  type: string;
};

// Блок с вопросами
export type QuestionsBlock = LessonBlock & {
  type: "questions";
  title: string;
  questions: string[];
};

// Теоретический блок
export type TheoryBlock = LessonBlock & {
  type: "theory";
  title: string;
  content: string;
};

// Блок вопрос-ответ
export type QnABlock = LessonBlock & {
  type: "qna";
  title: string;
  items: {
    question: string;
    answer: string;
  }[];
};

// Практический блок
export type PracticeBlock = LessonBlock & {
  type: "practice";
  title: string;
  description: string[];
};

// Блок с примером
export type ExampleBlock = LessonBlock & {
  type: "example";
  title: string;
  showCode: boolean;
  showExample: boolean;
  code?: string; // Сделаем поле опциональным
  explanation: string;
  // Опциональное поле для явного указания типа кода
  codeType?: "html" | "css" | "javascript" | "html-snippet";
};

// Блок с дополнительными материалами
export type ResourcesBlock = LessonBlock & {
  type: "resources";
  title: string;
  links: {
    text: string;
    url: string;
  }[];
};

// Объединенный тип для всех возможных блоков урока
export type AnyLessonBlock =
  | QuestionsBlock
  | TheoryBlock
  | QnABlock
  | PracticeBlock
  | ExampleBlock
  | ResourcesBlock;

// Основной тип урока
export type Lesson = {
  id: number;
  title: string;
  motivation: string;
  blocks: AnyLessonBlock[];
};

// Тип урока с категорией
export type LessonWithCategory = Lesson & {
  category: Category;
  completed?: boolean;
};

// Тип для главной страницы
export type LessonPreview = {
  id: number;
  title: string;
  motivation: string;
  category: Category;
  completed?: boolean;
};

// Тип для страницы урока
export type LessonPageData = {
  id: number;
  title: string;
  category: Category;
  blocks: AnyLessonBlock[];
};

// Утилитарные типы для фильтрации
export type MainPageFields = Pick<
  LessonWithCategory,
  "id" | "title" | "motivation" | "category"
>;
export type LessonPageFields = Pick<
  LessonWithCategory,
  "id" | "title" | "category" | "blocks"
>;

// Type guards для проверки типов блоков
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isQuestionsBlock(
  block: AnyLessonBlock
): block is QuestionsBlock {
  return block.type === "questions";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isTheoryBlock(block: AnyLessonBlock): block is TheoryBlock {
  return block.type === "theory";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isQnABlock(block: AnyLessonBlock): block is QnABlock {
  return block.type === "qna";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isPracticeBlock(block: AnyLessonBlock): block is PracticeBlock {
  return block.type === "practice";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isExampleBlock(block: AnyLessonBlock): block is ExampleBlock {
  return block.type === "example";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isResourcesBlock(
  block: AnyLessonBlock
): block is ResourcesBlock {
  return block.type === "resources";
}
