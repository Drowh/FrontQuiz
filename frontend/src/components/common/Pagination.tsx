// src/common/Pagination.tsx
import { memo, useCallback, useMemo } from "react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiMoreFill,
} from "@remixicon/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = memo(
  ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const handlePageChange = useCallback(
      (page: number) => {
        onPageChange(page);
      },
      [onPageChange]
    );

    // Вычисляем какие страницы показать
    const getVisiblePages = useMemo(() => {
      const delta = 1; // Количество страниц слева и справа от текущей
      const range = [];
      const rangeWithDots = [];

      // Всегда показываем первую страницу
      range.push(1);

      // Если есть промежуток между 1 и началом диапазона вокруг текущей страницы
      if (currentPage - delta > 2) {
        rangeWithDots.push(1);
        rangeWithDots.push("...");
      } else if (currentPage - delta === 2) {
        rangeWithDots.push(1);
        rangeWithDots.push(2);
      } else {
        rangeWithDots.push(1);
      }

      // Добавляем страницы вокруг текущей
      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        if (!rangeWithDots.includes(i) && i !== 1) {
          rangeWithDots.push(i);
        }
      }

      // Если есть промежуток между концом диапазона и последней страницей
      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...");
        rangeWithDots.push(totalPages);
      } else if (currentPage + delta === totalPages - 1) {
        if (!rangeWithDots.includes(totalPages - 1)) {
          rangeWithDots.push(totalPages - 1);
        }
        rangeWithDots.push(totalPages);
      } else if (totalPages > 1 && !rangeWithDots.includes(totalPages)) {
        rangeWithDots.push(totalPages);
      }

      // Убираем дубликаты и сортируем
      return [...new Set(rangeWithDots)].sort((a, b) => {
        if (a === "...") return 0;
        if (b === "...") return 0;
        return (a as number) - (b as number);
      });
    }, [currentPage, totalPages]);

    const renderPageButton = useCallback(
      (pageNumber: number | string, index: number) => {
        if (pageNumber === "...") {
          return (
            <span
              key={`dots-${index}`}
              className="px-2 py-2 text-text-secondary-light dark:text-text-secondary flex items-center"
            >
              <RiMoreFill size={16} />
            </span>
          );
        }

        const page = pageNumber as number;
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-secondary-light dark:bg-secondary text-light-bg dark:text-white"
                : "bg-light-card dark:bg-gray-800 text-text-primary-light dark:text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        );
      },
      [currentPage, handlePageChange]
    );

    return (
      <nav
        className="flex justify-center items-center space-x-1 mt-6 px-4"
        aria-label="Пагинация"
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full bg-light-card dark:bg-gray-800 text-text-primary-light dark:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Предыдущая страница"
        >
          <RiArrowLeftSLine size={18} />
        </button>

        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide max-w-[calc(100vw-120px)]">
          {getVisiblePages.map((page, index) => renderPageButton(page, index))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full bg-light-card dark:bg-gray-800 text-text-primary-light dark:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Следующая страница"
        >
          <RiArrowRightSLine size={18} />
        </button>
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

export default Pagination;
