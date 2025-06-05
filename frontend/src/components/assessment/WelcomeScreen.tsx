import React, { useState } from "react";
import { FaHtml5, FaCss3Alt, FaJs } from "react-icons/fa";

interface WelcomeScreenProps {
  // В будущем здесь будут props, например, для запуска теста
  startAssessment: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ startAssessment }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] py-6 px-4 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-secondary-light/5 dark:from-primary/5 dark:to-secondary/5"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-light/3 to-transparent dark:via-primary/3 animate-gradient-flow"></div>

      <div className="relative z-10 text-center mb-8 sm:mb-12 animate-fade-in-up">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-new-rocker text-primary-light dark:text-primary mb-3 sm:mb-4 leading-tight">
          Оцените свой Frontend уровень
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-text-primary-light dark:text-text-primary opacity-90">
          21 профессиональный вызов за 15 минут
        </p>
        <div className="mt-4 h-1 w-20 mx-auto bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary to-secondary rounded-full"></div>
      </div>

      {/* Карточки технологий */}
      <div
        className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-12 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        {[
          {
            icon: FaHtml5,
            name: "HTML",
            color: "text-orange-500",
            bgColor: "from-orange-500/10 to-orange-600/20",
          },
          {
            icon: FaCss3Alt,
            name: "CSS",
            color: "text-blue-500",
            bgColor: "from-blue-500/10 to-blue-600/20",
          },
          {
            icon: FaJs,
            name: "JS",
            color: "text-yellow-500",
            bgColor: "from-yellow-500/10 to-yellow-600/20",
          },
        ].map((tech, index) => (
          <div
            key={tech.name}
            className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${tech.bgColor} backdrop-blur-sm rounded-2xl shadow-lg flex flex-col items-center justify-center text-xs sm:text-sm font-tektur ${tech.color} border border-white/20 dark:border-white/10 transform transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-${tech.color}/20 cursor-pointer group`}
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            <tech.icon className="w-8 h-8 sm:w-10 sm:h-10 mb-1 group-hover:animate-bounce" />
            <span className="group-hover:font-bold transition-all duration-300">
              {tech.name}
            </span>
          </div>
        ))}
      </div>

      {/* Кнопка запуска */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
        <button
          onClick={startAssessment}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative bg-secondary-light dark:bg-secondary text-white font-tektur py-3 sm:py-4 px-6 sm:px-10 rounded-full text-base sm:text-lg md:text-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-light/30 dark:focus:ring-primary/30 overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            Начать челлендж
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary dark:to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
