import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AssessmentState,
  Question,
  UserAnswer,
} from "../types/assessment.types";
import { generateAssessmentQuestions } from "../utils/questionGenerator";

// Фиктивная функция для генерации вопросов (удалить после полной реализации generateAssessmentQuestions)
// const generateRandomQuestions = (): Question[] => {
//   console.warn(
//     "Using placeholder generateRandomQuestions. Implement actual logic."
//   );
//   return [];
// };

const initialState: Omit<
  AssessmentState,
  | "startAssessment"
  | "submitAnswer"
  | "finishAssessment"
  | "resetAssessment"
  | "navigateToReview"
  | "navigateToScoreboard"
> = {
  currentScreen: "welcome",
  selectedQuestions: [],
  userAnswers: [],
  timeRemaining: 15 * 60, // 15 минут в секундах
  currentQuestionIndex: 0,
  assessmentStartTime: null,
  competencyScore: {
    html: { correct: 0, total: 0 },
    css: { correct: 0, total: 0 },
    javascript: { correct: 0, total: 0 },
  },
  // УДАЛЯЕМ ОТСЮДА ОПРЕДЕЛЕНИЯ ФУНКЦИЙ:
  // startAssessment: () => {},
  // submitAnswer: () => {},
  // finishAssessment: () => {},
  // resetAssessment: () => {},
};

let timerInterval: number | null = null; // Variable to hold the interval ID

const clearTimer = () => {
  if (timerInterval !== null) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      ...initialState, // Теперь здесь только свойства состояния

      // ОПРЕДЕЛЯЕМ ФУНКЦИИ ЗДЕСЬ:
      startAssessment: async () => {
        clearTimer();
        set({ currentScreen: "loading" });
        try {
          let questions = await generateAssessmentQuestions();

          if (questions.length === 0) {
            console.warn("No questions generated, cannot start assessment.");
            set({ currentScreen: "welcome" });
            return;
          }

          set({
            currentScreen: "assessment",
            selectedQuestions: questions,
            userAnswers: [],
            timeRemaining: 15 * 60,
            currentQuestionIndex: 0,
            assessmentStartTime: new Date(),
            competencyScore: {
              html: { correct: 0, total: 0 },
              css: { correct: 0, total: 0 },
              javascript: { correct: 0, total: 0 },
            },
          });

          timerInterval = window.setInterval(() => {
            set((currentState) => {
              if (
                currentState.currentScreen !== "assessment" ||
                currentState.timeRemaining <= 1
              ) {
                clearTimer();
                if (currentState.timeRemaining <= 1) {
                  console.log("Time is up, navigating to scoreboard.");
                  return { timeRemaining: 0, currentScreen: "scoreboard" };
                }
                return currentState;
              }
              return { timeRemaining: currentState.timeRemaining - 1 };
            });
          }, 1000);
        } catch (error) {
          console.error("Failed to start assessment:", error);
          clearTimer();
          set({ currentScreen: "welcome" });
        }
      },

      submitAnswer: (selectedOptionIndex: number) => {
        set((state): Partial<AssessmentState> => {
          // console.log("submitAnswer: Inside set callback.");
          // console.log("submitAnswer: Current state for check:", {
          //   currentQuestion:
          //     state.selectedQuestions[state.currentQuestionIndex],
          //   assessmentStartTime: state.assessmentStartTime,
          // });
          const currentQuestion =
            state.selectedQuestions[state.currentQuestionIndex];
          // console.log(
          //   "submitAnswer: After getting currentQuestion:",
          //   currentQuestion
          // );

          if (!currentQuestion || !state.assessmentStartTime) {
            // console.error(
            //   "submitAnswer error: question or start time missing.",
            //   { currentQuestion, startTime: state.assessmentStartTime }
            // );
            return {};
          }

          const isCorrect = selectedOptionIndex === currentQuestion.solution;
          // console.log(
          //   `submitAnswer: After calculating isCorrect: ${isCorrect}`
          // );

          const now = new Date();
          const timeSpent = Math.floor(
            (now.getTime() - state.assessmentStartTime.getTime()) / 1000
          );

          const nextQuestionIndex = state.currentQuestionIndex + 1;
          const isLastQuestion =
            nextQuestionIndex >= state.selectedQuestions.length;

          const newUserAnswer: UserAnswer = {
            questionId: currentQuestion.id,
            selectedOption: selectedOptionIndex,
            isCorrect,
            timeSpent,
          };

          const updatedCompetencyScore = { ...state.competencyScore };
          const category = currentQuestion.technology;

          if (updatedCompetencyScore[category]) {
            updatedCompetencyScore[category] = {
              ...updatedCompetencyScore[category],
              total: updatedCompetencyScore[category].total + 1,
              correct: isCorrect
                ? updatedCompetencyScore[category].correct + 1
                : updatedCompetencyScore[category].correct,
            };
          }

          // Логика перехода
          if (isLastQuestion) {
            console.log(
              "submitAnswer: Last question reached. Navigating to scoreboard."
            );
            clearTimer();
            return {
              userAnswers: [...state.userAnswers, newUserAnswer],
              competencyScore: updatedCompetencyScore,
              currentQuestionIndex: nextQuestionIndex, // Обновляем индекс для полноты данных, хоть он и будет >= length
              currentScreen: "scoreboard",
            };
          }

          // console.log(
          //   `submitAnswer: Moving to question ${nextQuestionIndex + 1}/${
          //     state.selectedQuestions.length
          //   }`
          // );
          return {
            userAnswers: [...state.userAnswers, newUserAnswer],
            competencyScore: updatedCompetencyScore,
            currentQuestionIndex: nextQuestionIndex,
          };
        });
      },

      finishAssessment: () => {
        clearTimer();
        set({ currentScreen: "scoreboard" });
        // console.log("finishAssessment called, navigating to scoreboard.");
      },

      resetAssessment: () => {
        clearTimer();
        set(initialState);
        // console.log("resetAssessment called.");
      },

      // Новое действие для перехода на экран ревью
      navigateToReview: () => {
        set({ currentScreen: "review" });
        // console.log("navigateToReview called, navigating to review screen.");
      },

      // Новое действие для перехода на экран результатов
      navigateToScoreboard: () => {
        set({ currentScreen: "scoreboard" });
        // console.log(
        //   "navigateToScoreboard called, navigating to scoreboard screen."
        // );
      },
    }),
    {
      name: "frontend-assessment",
      partialize: (state) => ({
        userAnswers: state.userAnswers,
        competencyScore: state.competencyScore,
        selectedQuestions: state.selectedQuestions,
        currentQuestionIndex: state.currentQuestionIndex,
      }),
    }
  )
);
