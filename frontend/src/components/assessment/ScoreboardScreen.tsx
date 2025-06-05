import React from "react";
import { useAssessmentStore } from "../../store/assessmentStore";
import { MdAssignment } from "react-icons/md";
import { HiRefresh } from "react-icons/hi";

const ScoreboardScreen: React.FC = () => {
  const {
    competencyScore,
    userAnswers,
    resetAssessment,
    assessmentStartTime,
    selectedQuestions,
    navigateToReview,
  } = useAssessmentStore();

  // Рассчитываем общую статистику
  const totalQuestionsAttempted = userAnswers.length;
  const correctAnswers = userAnswers.filter(
    (answer) => answer.isCorrect
  ).length;
  const accuracy =
    totalQuestionsAttempted > 0
      ? (correctAnswers / totalQuestionsAttempted) * 100
      : 0;

  // Расчет времени выполнения (простота: от старта до последнего ответа или текущего времени, если нет ответов)
  const endTime =
    userAnswers.length > 0
      ? new Date(
          userAnswers[userAnswers.length - 1].timeSpent * 1000 +
            (assessmentStartTime?.getTime() || 0)
        )
      : assessmentStartTime || new Date();
  const totalTimeInSeconds =
    assessmentStartTime && userAnswers.length > 0
      ? userAnswers[userAnswers.length - 1].timeSpent
      : 0;

  const minutes = Math.floor(totalTimeInSeconds / 60);
  const seconds = totalTimeInSeconds % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  // Расчет точности по технологиям для текстового резюме
  const htmlAccuracy =
    competencyScore.html.total > 0
      ? (competencyScore.html.correct / competencyScore.html.total) * 100
      : 0;
  const cssAccuracy =
    competencyScore.css.total > 0
      ? (competencyScore.css.correct / competencyScore.css.total) * 100
      : 0;
  const jsAccuracy =
    competencyScore.javascript.total > 0
      ? (competencyScore.javascript.correct /
          competencyScore.javascript.total) *
        100
      : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] py-10 px-4">
      <div className="w-full max-w-2xl bg-light-card dark:bg-dark-card rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-tektur md:text-4xl text-primary-light dark:text-primary mb-6">
          Профессиональный профиль
        </h2>

        <div className="mb-8 space-y-2 text-text-primary-light dark:text-text-primary">
          <p>
            <span className="font-tektur">Решено задач:</span> {correctAnswers}{" "}
            из {selectedQuestions.length}
          </p>
          {totalQuestionsAttempted > 0 && (
            <p>
              <span className="font-tektur">Время выполнения:</span>{" "}
              {formattedTime}
            </p>
          )}
          <p>
            <span className="font-tektur">Точность ответов:</span>{" "}
            {accuracy.toFixed(1)}%
          </p>
        </div>

        {/* Визуальные элементы: вертикальные progress bars */}
        <div className="mb-8">
          <h3 className="text-xl font-tektur text-primary-light dark:text-primary mb-4">
            Технологии
          </h3>
          <div className="flex justify-around items-end h-40 md:h-48 bg-gray-100 dark:bg-gray-800 rounded-md p-4 border border-gray-300 dark:border-gray-600">
            {Object.entries(competencyScore).map(([tech, score]) => {
              const techAccuracy =
                score.total > 0 ? (score.correct / score.total) * 100 : 0;

              const barHeight =
                techAccuracy > 0 ? Math.max(techAccuracy, 5) : 0;
              const barColor =
                tech === "html"
                  ? "bg-orange-500"
                  : tech === "css"
                  ? "bg-blue-500"
                  : "bg-yellow-500";

              const textColor =
                tech === "html"
                  ? "text-orange-500"
                  : tech === "css"
                  ? "text-blue-500"
                  : "text-yellow-500";

              return (
                <div
                  key={tech}
                  className="flex flex-col items-center h-full justify-end"
                >
                  <div
                    className={`w-6 md:w-8 rounded-t-sm transition-all duration-500 ease-out ${barColor}`}
                    style={{ height: `${barHeight > 0 ? barHeight : 1}%` }}
                    title={`${tech.toUpperCase()}: ${techAccuracy.toFixed(1)}%`}
                  ></div>
                  <div className="mt-2 text-sm font-tektur text-center">
                    <div className={textColor}>
                      {tech === "javascript" ? "JS" : tech.toUpperCase()}
                    </div>
                    <div className="text-text-secondary-light dark:text-text-secondary">
                      {techAccuracy.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          {/* Кнопка Разбор решений */}
          <button
            onClick={() => navigateToReview()}
            className="bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary font-tektur py-3 px-6 rounded-md hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400/50 dark:focus:ring-gray-600/50 flex items-center gap-2"
            aria-label="Разбор ответов"
          >
            <MdAssignment className="w-5 h-5" />
            Разбор ответов
          </button>

          {/* Кнопка Новое испытание */}
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

export default ScoreboardScreen;
