import React from "react";

interface TimerProps {
  timeRemaining: number; // Время в секундах
  totalTime: number; // Общее время в секундах
}

const Timer: React.FC<TimerProps> = ({ timeRemaining, totalTime }) => {
  const timePercentage = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const getTimerBg = () => {
    if (timePercentage > 50) return "bg-green-500";
    if (timePercentage > 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-tektur text-text-secondary-light dark:text-text-secondary">
            Время
          </span>
        </div>
        <div
          className={`text-sm font-tektur px-3 py-1 rounded-full ${
            timePercentage > 25
              ? "text-primary-light dark:text-primary"
              : "text-red-500 animate-pulse"
          }`}
        >
          {minutes}:{seconds < 10 ? "0" : ""}
          {seconds}
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${getTimerBg()} relative overflow-hidden`}
          style={{ width: `${timePercentage}%` }}
        >
          {timePercentage <= 25 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
