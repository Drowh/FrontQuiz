import React from "react";
import { useAssessmentStore } from "../../store/assessmentStore";
import WelcomeScreen from "./WelcomeScreen";
import AssessmentScreen from "./AssessmentScreen";
import ScoreboardScreen from "./ScoreboardScreen";
import ReviewScreen from "./ReviewScreen";
// Импортировать другие экраны по мере их создания
// import ReviewScreen from './ReviewScreen';

const QuizPage: React.FC = () => {
  const { currentScreen, startAssessment } = useAssessmentStore();

  switch (currentScreen) {
    case "welcome":
      return <WelcomeScreen startAssessment={startAssessment} />;
    case "assessment":
      return <AssessmentScreen />;
    case "scoreboard":
      return <ScoreboardScreen />;
    case "review":
      return <ReviewScreen />;
    case "loading":
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] py-10">
          <div className="text-xl md:text-2xl font-tektur text-text-primary-light dark:text-text-primary">
            Загрузка вопросов...
          </div>
          {/* Можно добавить спиннер или анимацию загрузки здесь */}
        </div>
      );
    // Добавить кейсы для других экранов по мере их создания
    // case 'review':
    //   return <ReviewScreen />;
    default:
      return <WelcomeScreen startAssessment={startAssessment} />; // Fallback
  }
};

export default QuizPage;
