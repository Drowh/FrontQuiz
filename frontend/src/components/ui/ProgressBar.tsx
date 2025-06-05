import React from "react";

interface ProgressBarProps {
  current: number; // текущее значение (например, номер вопроса)
  total: number; // общее значение (например, общее количество вопросов)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-tektur text-text-secondary-light dark:text-text-secondary">
          Прогресс
        </span>
        <span className="text-sm font-tektur text-primary-light dark:text-primary">
          {current} из {total}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
        <div
          className="h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ 
            width: `${progressPercentage}%`,
            background: 'linear-gradient(90deg, #4a2ca3, #3cdfff, #4a2ca3)',
            backgroundSize: '200% 100%',
            animation: 'gradient-progress 2s ease infinite'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
