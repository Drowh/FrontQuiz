export type Question = {
  id: number;
  technology: "html" | "css" | "javascript";
  challenge: string;
  variants: string[];
  solution: number;
  insight: string;
};

export type UserAnswer = {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
  timeSpent: number;
};

export type AssessmentState = {
  // Состояние теста
  currentScreen: "welcome" | "assessment" | "scoreboard" | "review" | "loading";
  selectedQuestions: Question[];
  userAnswers: UserAnswer[];

  // Таймер и прогресс
  timeRemaining: number; // в секундах
  currentQuestionIndex: number;
  assessmentStartTime: Date | null;

  // Результаты
  competencyScore: {
    html: { correct: number; total: number };
    css: { correct: number; total: number };
    javascript: { correct: number; total: number };
  };

  // Действия
  startAssessment: () => void;
  submitAnswer: (answer: number) => void;
  finishAssessment: () => void;
  resetAssessment: () => void;
  navigateToReview: () => void;
  navigateToScoreboard: () => void;
};

// Интерфейс состояния Zustand будет определен позже
// export interface AssessmentState { ... }
