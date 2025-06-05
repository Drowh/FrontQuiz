import { useState, useEffect } from "react";
import { useAssessmentStore } from "../../store/assessmentStore";
import ProgressBar from "../ui/ProgressBar";
import Timer from "../ui/Timer";
import { FaCheckCircle, FaTimesCircle, FaSignOutAlt } from "react-icons/fa";

const AssessmentScreen = () => {
  const {
    selectedQuestions,
    currentQuestionIndex,
    submitAnswer,
    timeRemaining,
    finishAssessment,
  } = useAssessmentStore();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Сброс локального состояния при переходе к новому вопросу
  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
  }, [currentQuestionIndex]);

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const totalQuestions = selectedQuestions.length;
  const totalTestTime = 15 * 60; // Общее время теста в секундах (15 минут)

  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    submitAnswer(selectedOption);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const handleFinishAssessment = () => {
    setShowConfirmModal(true);
  };

  const confirmFinishAssessment = () => {
    finishAssessment();
    setShowConfirmModal(false);
  };

  if (!currentQuestion) {
    // Это условие теперь может сработать в конце теста, когда currentQuestionIndex >= selectedQuestions.length
    // Логика переключения на ScoreboardScreen уже есть в submitAnswer
    return <div>Загрузка вопросов или тест завершен...</div>; // Временный текст
  }

  const isCorrect = selectedOption === currentQuestion.solution;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="flex mt-2 flex-col items-center min-h-[calc(100vh-65px)] py-2 px-3">
      <div className="w-full max-w-4xl bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-xl shadow-2xl p-3 sm:p-4 border border-white/20 dark:border-white/10">
        {/* Прогресс-бар и таймер в одну строку */}
        <div className="flex gap-4 items-center mb-3">
          <div className="flex-1">
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={totalQuestions}
            />
          </div>
          <div className="flex-1 mt-1">
            <Timer timeRemaining={timeRemaining} totalTime={totalTestTime} />
          </div>
        </div>

        {/* Вопрос */}
        <div className="mb-3">
          <div className="flex items-start gap-2 mb-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary dark:to-secondary rounded-full flex items-center justify-center text-white font-tektur text-xs sm:text-sm font-bold flex-shrink-0">
              {currentQuestionIndex + 1}
            </div>
            <h3 className="text-base sm:text-lg md:text-xl text-text-primary-light dark:text-text-primary leading-tight">
              {currentQuestion.challenge}
            </h3>
          </div>
        </div>

        {/* Варианты ответов */}
        <div className="grid grid-cols-1 gap-2 mb-3">
          {currentQuestion.variants.map((variant, index) => {
            const isSelected = selectedOption === index;
            const isCorrectAnswer = index === currentQuestion.solution;

            let buttonClass =
              "w-full text-left p-2 sm:p-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 transform hover:scale-[1.01] group relative overflow-hidden";

            if (showFeedback) {
              if (isSelected) {
                buttonClass += isCorrect
                  ? " bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-500 text-green-700 dark:text-green-300 shadow-lg shadow-green-500/20"
                  : " bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-500 text-red-700 dark:text-red-300 shadow-lg shadow-red-500/20";
              } else if (isCorrectAnswer) {
                buttonClass +=
                  " bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-500 text-green-700 dark:text-green-300 shadow-lg shadow-green-500/20";
              } else {
                buttonClass +=
                  " border-gray-300 dark:border-gray-600 opacity-50";
              }
            } else {
              buttonClass +=
                " border-light-border dark:border-dark-border hover:border-primary-light dark:hover:border-primary hover:bg-gradient-to-r hover:from-primary-light/5 hover:to-secondary-light/5 dark:hover:from-primary/5 dark:hover:to-secondary/5 focus:ring-primary-light/50 dark:focus:ring-primary/50 hover:shadow-lg";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <div className="flex items-center gap-2 relative z-10">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center font-tektur font-bold text-xs sm:text-sm flex-shrink-0 transition-all duration-300 ${
                      showFeedback && isSelected && isCorrect
                        ? "border-green-500 bg-green-500 text-white"
                        : showFeedback && isSelected && !isCorrect
                        ? "border-red-500 bg-red-500 text-white"
                        : showFeedback && isCorrectAnswer
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-primary-light dark:border-primary group-hover:border-primary-light dark:group-hover:border-primary group-hover:bg-primary-light/10"
                    }`}
                  >
                    {showFeedback && isSelected && isCorrect && (
                      <FaCheckCircle className="text-xs" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <FaTimesCircle className="text-xs" />
                    )}
                    {showFeedback && isCorrectAnswer && !isSelected && (
                      <FaCheckCircle className="text-xs" />
                    )}
                    {!showFeedback && String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-text-primary-light dark:text-text-primary text-sm sm:text-base leading-tight group-hover:font-medium transition-all duration-300">
                    {variant}
                  </span>
                </div>
                {!showFeedback && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-light/10 to-transparent dark:via-primary/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Кнопки управления */}
        <div className="flex gap-2">
          {showFeedback ? (
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="flex-1 bg-secondary-light dark:bg-secondary text-white font-tektur py-2.5 px-3 sm:py-3 sm:px-4 rounded-lg text-sm shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-primary-light/30 dark:focus:ring-primary/30 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {isLastQuestion ? (
                  "Завершить тест"
                ) : (
                  <>
                    <span className="sm:hidden">Следующий</span>
                    <span className="hidden sm:inline">Следующий вопрос →</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          ) : (
            <div className="flex-1" />
          )}
          {!isLastQuestion && (
            <button
              onClick={handleFinishAssessment}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white font-tektur py-2.5 px-3 sm:py-3 sm:px-4 rounded-lg text-sm shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-red-500/30 relative overflow-hidden group"
            >
              <FaSignOutAlt className="text-sm" />
              <span className="relative z-10 hidden sm:inline">Завершить</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          )}
        </div>

        {/* Обратная связь */}
        {showFeedback && (
          <div className="space-y-3 mt-2 animate-fade-in-up">
            <div
              className={`p-3 rounded-lg border-l-4 ${
                isCorrect
                  ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-500"
                  : "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-500"
              } shadow-lg`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <FaCheckCircle className="text-green-500 text-lg" />
                ) : (
                  <FaTimesCircle className="text-red-500 text-lg" />
                )}
                <p
                  className={`font-tektur text-base sm:text-lg font-bold ${
                    isCorrect
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {isCorrect ? "Правильно!" : "Неправильно"}
                </p>
              </div>
              <p
                className={`text-sm leading-relaxed ${
                  isCorrect
                    ? "text-green-600 dark:text-green-200"
                    : "text-red-600 dark:text-red-200"
                } max-h-32 overflow-y-auto`}
              >
                {currentQuestion.insight}
              </p>
            </div>
          </div>
        )}

        {/* Модальное окно подтверждения */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-white/20 dark:border-white/10 animate-fade-in-up">
              <h3 className="text-xl font-tektur font-bold text-text-primary-light dark:text-text-primary mb-4">
                Завершить тест?
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary mb-6">
                Вы уверены, что хотите завершить тест? Все неотвеченные вопросы
                будут засчитаны как неправильные.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-tektur py-2 px-4 rounded-lg text-sm shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-gray-500/30"
                >
                  Продолжить
                </button>
                <button
                  onClick={confirmFinishAssessment}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white font-tektur py-2 px-4 rounded-lg text-sm shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-red-500/30"
                >
                  Завершить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentScreen;
