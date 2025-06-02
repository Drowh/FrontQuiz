// src/components/lesson/LessonCard.tsx
import { useNavigate } from "react-router-dom";
import { memo, useCallback } from "react";
import CustomSwitch from "../ui/CustomSwitch";
import CategoryBadge from "../ui/CategoryBadge";
import { RiArrowRightLine } from "@remixicon/react";

interface LessonCardProps {
  title: string;
  description: string;
  categories: string[];
  completed: boolean;
  onToggleCompleted: (completed: boolean) => void;
  index: number;
  className?: string;
}

const LessonCard = memo(
  ({
    title,
    description,
    categories,
    completed,
    onToggleCompleted,
    index,
    className = "",
  }: LessonCardProps) => {
    const navigate = useNavigate();
    const category = categories[0] || "unknown";

    const handleCardClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        navigate(`/lesson/${category}/${index}`);
      },
      [category, index, navigate]
    );

    const handleSwitchChange = useCallback(
      (checked: boolean) => {
        onToggleCompleted(checked);
      },
      [onToggleCompleted]
    );

    const handleSwitchContainerClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    const handleOpenLesson = useCallback(() => {
      navigate(`/lesson/${category}/${index}`);
    }, [category, index, navigate]);

    return (
      <article
        className={`bg-light-card dark:bg-dark-card rounded-lg p-4 sm:p-5 border border-transparent hover:border-primary-light dark:hover:border-primary hover:-translate-y-[5px] hover:shadow-card-hover-light dark:hover:shadow-card-hover hover:bg-opacity-90 transition-all duration-300 cursor-pointer ${className}`}
        onClick={handleCardClick}
        aria-label={`Открыть тему ${title}`}
      >
        <header className="flex justify-between items-start mb-3 gap-3">
          <h3 className="text-xl sm:text-2xl font-tektur text-primary-light dark:text-primary flex-1 min-w-0">
            {`Тема ${index}: ${title}`}
          </h3>

          <div
            className="flex items-center gap-2 shrink-0"
            onClick={handleSwitchContainerClick}
            aria-label={`Переключатель статуса темы ${title}`}
          >
            <div className="p-2 -m-2 flex">
              <CustomSwitch
                checked={completed}
                onChange={handleSwitchChange}
                ariaLabel={`Отметить тему ${title} как ${
                  completed ? "не пройденную" : "пройденную"
                }`}
              />
            </div>
            <span className="hidden sm:block text-base text-text-secondary-light dark:text-text-secondary w-28">
              {completed ? "Пройден" : "Не пройден"}
            </span>
          </div>
        </header>

        <p className="text-base sm:text-lg text-text-secondary-light dark:text-text-secondary mb-4">
          {description}
        </p>

        <div
          className="flex flex-wrap gap-2 mb-4"
          role="list"
          aria-label="Категории темы"
        >
          {categories.map((category) => (
            <CategoryBadge key={category} label={category} />
          ))}
        </div>

        <footer className="flex justify-end items-center">
          <button
            onClick={handleOpenLesson}
            aria-label={`Открыть тему ${title}`}
            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 text-light-bg dark:text-dark-bg font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light/50 dark:focus:ring-primary/50 btn-progress-animated-slow btn-progress-hover hover:shadow-card-hover-light dark:hover:shadow-card-hover"
          >
            <RiArrowRightLine className="sm:mr-2" size={18} />
            <span className="hidden sm:inline">Открыть</span>
          </button>
        </footer>
      </article>
    );
  }
);

LessonCard.displayName = "LessonCard";

export default LessonCard;
