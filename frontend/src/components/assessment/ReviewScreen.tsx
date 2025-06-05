import React, { useState } from "react";
import { useAssessmentStore } from "../../store/assessmentStore";
import {
  HiArrowLeft,
  HiRefresh,
  HiChevronDown,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi";

const ReviewScreen: React.FC = () => {
  const {
    selectedQuestions,
    userAnswers,
    resetAssessment,
    navigateToScoreboard,
  } = useAssessmentStore();

  // Состояние для управления открытыми аккордеонами
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);

  const toggleAccordion = (questionId: number) => {
    setOpenQuestionId(openQuestionId === questionId ? null : questionId);
  };

  // Сопоставляем ответы пользователя по questionId для быстрого доступа
  const userAnswersMap = userAnswers.reduce((map, answer) => {
    map[answer.questionId] = answer;
    return map;
  }, {} as { [key: number]: (typeof userAnswers)[0] });

  // Подсчет правильных ответов
  const correctAnswers = userAnswers.filter(
    (answer) => answer.isCorrect
  ).length;
  const totalQuestions = selectedQuestions.length;

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-65px)] py-4 px-3">
      <div className="w-full max-w-4xl bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 border border-white/20 dark:border-white/10">
        {/* Заголовок с результатом */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-tektur bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary dark:to-secondary bg-clip-text text-transparent mb-3">
            Разбор ответов
          </h2>
          <div className="flex items-center justify-center gap-2 text-text-secondary-light dark:text-text-secondary">
            <div className="flex items-center gap-1">
              <HiCheckCircle className="text-green-500" />
              <span className="text-sm font-medium">
                {correctAnswers} правильных
              </span>
            </div>
            <span className="text-sm">из {totalQuestions}</span>
          </div>
        </div>

        {/* Список вопросов */}
        <div className="space-y-3 mb-6">
          {selectedQuestions.map((question, index) => {
            const userAnswer = userAnswersMap[question.id];
            const isCorrect = userAnswer?.isCorrect;
            const isOpen = openQuestionId === question.id;

            return (
              <div
                key={question.id}
                className={`border-2 rounded-xl transition-all duration-300 overflow-hidden ${
                  isCorrect === true
                    ? "border-green-500/30 bg-gradient-to-r from-green-50/50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 shadow-lg shadow-green-500/10"
                    : isCorrect === false
                    ? "border-red-500/30 bg-gradient-to-r from-red-50/50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 shadow-lg shadow-red-500/10"
                    : "border-gray-500/30 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-900/20 dark:to-gray-800/20"
                } ${
                  isOpen
                    ? "ring-2 ring-primary-light/20 dark:ring-primary/20"
                    : ""
                }`}
              >
                <button
                  className="flex justify-between items-center w-full text-left p-4 focus:outline-none group transition-all duration-200 hover:bg-white/30 dark:hover:bg-white/5"
                  onClick={() => toggleAccordion(question.id)}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-tektur font-bold flex-shrink-0 ${
                        isCorrect === true
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : isCorrect === false
                          ? "bg-gradient-to-r from-red-500 to-red-600"
                          : "bg-gradient-to-r from-gray-500 to-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-text-primary-light dark:text-text-primary leading-relaxed group-hover:text-primary-light dark:group-hover:text-primary transition-colors duration-200">
                      {question.challenge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <HiChevronDown
                      className={`text-text-secondary-light dark:text-text-secondary transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 border-t border-light-border/50 dark:border-dark-border/50 animate-fade-in-up">
                    <div className="space-y-4">
                      {/* Ваш ответ */}
                      <div
                        className={`p-3 rounded-lg border-l-4 ${
                          isCorrect === true
                            ? "bg-green-50/50 dark:bg-green-900/20 border-green-500"
                            : "bg-red-50/50 dark:bg-red-900/20 border-red-500"
                        }`}
                      >
                        <p className="text-sm font-tektur font-semibold mb-1 text-text-primary-light dark:text-text-primary">
                          Ваш ответ:
                        </p>
                        <p
                          className={`text-sm ${
                            isCorrect === true
                              ? "text-green-700 dark:text-green-300"
                              : "text-red-700 dark:text-red-300"
                          }`}
                        >
                          {userAnswer
                            ? question.variants[userAnswer.selectedOption]
                            : "Нет ответа"}
                        </p>
                      </div>

                      {/* Правильный ответ */}
                      {!isCorrect && (
                        <div className="p-3 rounded-lg border-l-4 bg-green-50/50 dark:bg-green-900/20 border-green-500">
                          <p className="text-sm font-tektur font-semibold mb-1 text-text-primary-light dark:text-text-primary">
                            Правильный ответ:
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            {question.variants[question.solution]}
                          </p>
                        </div>
                      )}

                      {/* Объяснение */}
                      <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                        <p className="text-sm font-tektur font-semibold mb-2 text-text-primary-light dark:text-text-primary">
                          Объяснение эксперта:
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                          {question.insight}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={navigateToScoreboard}
            className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-text-primary-light dark:text-text-primary font-tektur py-3 px-6 rounded-xl hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-gray-400/30 flex items-center justify-center gap-2 group relative overflow-hidden"
            aria-label="Вернуться к результатам"
          >
            <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="hidden sm:inline">Вернуться к результатам</span>
            <span className="sm:hidden">Результаты</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          <button
            onClick={resetAssessment}
            className="bg-secondary-light dark:bg-secondary text-white font-tektur py-3 px-6 rounded-xl hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-secondary-light/30 dark:focus:ring-secondary/30 flex items-center justify-center gap-2 group relative overflow-hidden"
            aria-label="Новое испытание"
          >
            <HiRefresh className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            Новое испытание
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewScreen;
