// src/components/layout/Sidebar.tsx
import { useMemo, useState } from "react";
import CustomCheckbox from "../ui/CustomCheckbox";
import { useLessonStore } from "../../store/useLessonStore";

const progressStyles = `
  @keyframes gradient {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = progressStyles;
  document.head.appendChild(style);
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    categoriesFilter,
    statusFilter,
    setCategoriesFilter,
    setStatusFilter,
    lessons,
  } = useLessonStore();

  const totalLessons = lessons.length;
  const completedCount = lessons.filter((lesson) => lesson.completed).length;
  const progressPercent =
    totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  // Динамически вычисляем категории из уроков
  const categories = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    const categoryDisplayNames: Record<string, string> = {};

    const baseCategories = ["HTML", "CSS", "JavaScript", "TypeScript", "React"];
    baseCategories.forEach((cat) => {
      categoryDisplayNames[cat.toLowerCase()] = cat;
    });

    lessons.forEach((lesson) => {
      const rawCategory: string = lesson.category || "Без категории";
      let normalizedCategory: string;
      let displayName: string;

      if (rawCategory === "Без категории") {
        normalizedCategory = "без категории";
        displayName = "Без категории";
      } else {
        normalizedCategory = rawCategory.toLowerCase();
        // Simple capitalization: first letter uppercase, rest lowercase
        displayName =
          normalizedCategory.charAt(0).toUpperCase() +
          normalizedCategory.slice(1);

        // Use canonical name if available (from baseCategories)
        if (
          baseCategories
            .map((c) => c.toLowerCase())
            .includes(normalizedCategory)
        ) {
          displayName = baseCategories.find(
            (c) => c.toLowerCase() === normalizedCategory
          )!;
        }
      }

      categoryCount[normalizedCategory] =
        (categoryCount[normalizedCategory] || 0) + 1;
      // Store display name, preferring the one from baseCategories if applicable
      if (
        !categoryDisplayNames[normalizedCategory] ||
        baseCategories.map((c) => c.toLowerCase()).includes(normalizedCategory)
      ) {
        categoryDisplayNames[normalizedCategory] = displayName;
      }
    });

    return Object.entries(categoryCount).map(([normalizedName, count]) => ({
      name: categoryDisplayNames[normalizedName] || normalizedName, // Use display name, fallback to normalized if somehow missing
      count,
    }));
  }, [lessons]);

  const statuses = ["Все вопросы", "Пройденные", "Непройденные"];

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setCategoriesFilter([...categoriesFilter, category]);
    } else {
      setCategoriesFilter(categoriesFilter.filter((c) => c !== category));
    }
  };

  const handleStatusChange = (status: string) => {
    if (status === "Все вопросы") setStatusFilter("all");
    else if (status === "Пройденные") setStatusFilter("completed");
    else setStatusFilter("not_completed");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Компонент для контента сайдбара
  const SidebarContent = () => (
    <div className="space-y-2">
      {/* Прогресс */}
      <div className="bg-light-card dark:bg-gray-900 rounded-lg p-4 space-y-4">
        <h2 className="text-xl lg:text-2xl font-tektur text-text-primary-light dark:text-text-primary mb-4">
          Ваш прогресс
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-lg text-text-secondary-light dark:text-text-secondary">
              Пройдено
            </span>
            <span className="text-xl text-primary-light dark:text-primary">
              {`${completedCount}/${totalLessons}`}
            </span>
          </div>
          <div className="w-full h-2 bg-light-border dark:bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary-light via-primary-light to-secondary-light dark:from-secondary dark:via-primary dark:to-secondary rounded-full transition-all duration-1000 ease-out animate-progress"
              style={{
                width: `${progressPercent}%`,
                backgroundSize: "200% 100%",
                animation: "gradient 2s ease infinite",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Категории */}
      <div className="bg-light-card dark:bg-gray-900 rounded-lg p-5 space-y-4">
        <h2 className="text-xl lg:text-2xl font-tektur text-text-primary-light dark:text-text-primary mb-4">
          Категории
        </h2>
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category.name}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center">
                <CustomCheckbox
                  type="checkbox"
                  checked={categoriesFilter.includes(category.name)}
                  onChange={(e) =>
                    handleCategoryChange(category.name, e.target.checked)
                  }
                />
                <span className="ml-3 text-lg text-text-secondary-light dark:text-text-secondary">
                  {category.name}
                </span>
              </div>
              <span className="text-xl text-primary-light dark:text-primary">
                {category.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Статус вопросов */}
      <div className="bg-light-card dark:bg-gray-900 rounded-lg p-5 space-y-4 relative">
        <h2 className="text-xl lg:text-2xl font-tektur text-text-primary-light dark:text-text-primary mb-4">
          Статус вопросов
        </h2>
        <div className="space-y-3">
          <img
            src="/assets/logoDrow.png"
            alt="logo"
            className="opacity-10 w-[250px] h-auto absolute left-1/2 top-0 -translate-x-1/2 pointer-events-none"
          />
          {statuses.map((status) => (
            <label
              key={status}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center">
                <CustomCheckbox
                  type="radio"
                  name="status"
                  checked={
                    status === "Все вопросы"
                      ? statusFilter === "all"
                      : status === "Пройденные"
                      ? statusFilter === "completed"
                      : statusFilter === "not_completed"
                  }
                  onChange={() => handleStatusChange(status)}
                />
                <span className="ml-3 text-lg text-text-secondary-light dark:text-text-secondary">
                  {status}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Кнопка переключения сайдбара - только на мобильных */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-[62px] left-4 z-50 bg-light-card dark:bg-gray-900 border-2 border-primary-light dark:border-primary text-text-primary-light dark:text-text-primary p-3 rounded-lg shadow-lg hover:bg-light-border dark:hover:bg-gray-800 transition-colors duration-200"
        aria-label={isOpen ? "Скрыть фильтры" : "Показать фильтры"}
      >
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay для мобильных устройств с анимацией */}
      <div
        className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
        aria-hidden={!isOpen}
      />

      {/* Десктопная версия - всегда видимая */}
      <aside className="hidden md:block md:sticky md:top-20 md:w-[250px] md:h-[calc(100vh-7rem)] md:overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Мобильная версия с анимацией slide-in */}
      <aside
        className={`md:hidden fixed top-20 left-0 z-[51] h-[calc(100vh-5rem)] w-[316px] pt-4 px-4 bg-light-bg dark:bg-dark-bg overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Кнопка закрытия на мобильных с анимацией */}
        <button
          onClick={toggleSidebar}
          className="absolute top-2 right-4 text-text-secondary-light dark:text-text-secondary hover:text-text-primary-light dark:hover:text-text-primary transition-all duration-200 hover:scale-110"
          aria-label="Закрыть фильтры"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
