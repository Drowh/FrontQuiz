// src/pages/LessonPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Container from "../components/common/Container";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiHomeLine,
} from "@remixicon/react";
import type { LessonWithCategory, Category } from "../types/lesson";
import { useAuth } from "../context/AuthContext";
import { useLessonStore } from "../store/useLessonStore";
import type { LessonBlock } from "../components/lesson-blocks";
import {
  QuestionsBlock,
  TheoryBlock,
  QnABlock,
  PracticeBlock,
  ExampleBlock,
  ResourcesBlock,
} from "../components/lesson-blocks";
import BlockWrapper from "../components/lesson-blocks/BlockWrapper";
import ScrollToTop from "../components/common/ScrollToTop";
import { useLesson } from "../utils/lessonCache";

interface LessonPageProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const LessonPage = ({ searchQuery, setSearchQuery }: LessonPageProps) => {
  const { category, id } = useParams<{ category: Category; id: string }>();
  const navigate = useNavigate();
  const { toggleCompleted, lessons } = useLessonStore();
  const { telegramId } = useAuth();
  const [isContentReady, setIsContentReady] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [nextLesson, setNextLesson] = useState<{
    id: number;
    category: Category;
  } | null>(null);
  const [prevLesson, setPrevLesson] = useState<{
    id: number;
    category: Category;
  } | null>(null);
  const [showLoader, setShowLoader] = useState(true);

  const parsedId = parseInt(id || "0", 10);
  const { data: lesson, isLoading } = useLesson(category as Category, parsedId);

  const lessonStatus =
    lessons.find((l) => l.category === category && l.id === parsedId)
      ?.completed || false;

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isNavigating]);

  useEffect(() => {
    if (lesson && !isLoading) {
      const timer = setTimeout(() => {
        setIsContentReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsContentReady(false);
    }
  }, [lesson, isLoading]);

  useEffect(() => {
    if (lessons && category) {
      const currentCategoryLessons = lessons
        .filter((l) => l.category === category)
        .sort((a, b) => a.id - b.id);

      const currentIndex = currentCategoryLessons.findIndex(
        (l) => l.id === parsedId
      );

      if (currentIndex !== -1) {
        if (currentIndex > 0) {
          const prev = currentCategoryLessons[currentIndex - 1];
          setPrevLesson({ id: prev.id, category: prev.category });
        } else {
          const allCategories = Array.from(
            new Set(lessons.map((l) => l.category))
          );
          const currentCategoryIndex = allCategories.indexOf(category);

          if (currentCategoryIndex > 0) {
            const prevCategory = allCategories[currentCategoryIndex - 1];
            const lastLessonInPrevCategory = lessons
              .filter((l) => l.category === prevCategory)
              .sort((a, b) => b.id - a.id)[0];

            if (lastLessonInPrevCategory) {
              setPrevLesson({
                id: lastLessonInPrevCategory.id,
                category: lastLessonInPrevCategory.category,
              });
            } else {
              setPrevLesson(null);
            }
          } else {
            setPrevLesson(null);
          }
        }

        if (currentIndex < currentCategoryLessons.length - 1) {
          const next = currentCategoryLessons[currentIndex + 1];
          setNextLesson({ id: next.id, category: next.category });
        } else {
          const allCategories = Array.from(
            new Set(lessons.map((l) => l.category))
          );
          const currentCategoryIndex = allCategories.indexOf(category);

          if (
            currentCategoryIndex !== -1 &&
            currentCategoryIndex < allCategories.length - 1
          ) {
            const nextCategory = allCategories[currentCategoryIndex + 1];
            const firstLessonInNextCategory = lessons
              .filter((l) => l.category === nextCategory)
              .sort((a, b) => a.id - b.id)[0];

            if (firstLessonInNextCategory) {
              setNextLesson({
                id: firstLessonInNextCategory.id,
                category: firstLessonInNextCategory.category,
              });
            } else {
              setNextLesson(null);
            }
          } else {
            setNextLesson(null);
          }
        }
      } else {
        setPrevLesson(null);
        setNextLesson(null);
      }
    }
  }, [lessons, category, parsedId]);

  const handlePrevClick = () => {
    if (prevLesson) {
      setIsNavigating(true);
      setIsContentReady(false);
      setTimeout(() => {
        navigate(`/lesson/${prevLesson.category}/${prevLesson.id}`, {
          replace: false,
          state: { from: "prev" },
        });
      }, 300);
    }
  };

  const handleBackClick = () => {
    setIsNavigating(true);
    setIsContentReady(false);
    setTimeout(() => {
      navigate("/", {
        replace: false,
        state: { from: "back" },
      });
    }, 300);
  };

  const handleToggleCompleted = (checked: boolean) => {
    if (id && category) {
      toggleCompleted(parsedId, checked, telegramId || "", category);
    }
  };

  const handleNextClick = () => {
    if (nextLesson) {
      setIsNavigating(true);
      setIsContentReady(false);
      setTimeout(() => {
        navigate(`/lesson/${nextLesson.category}/${nextLesson.id}`, {
          replace: false,
          state: { from: "next" },
        });
      }, 300);
    }
  };

  const renderBlock = (block: LessonBlock, index: number) => {
    switch (block.type) {
      case "questions":
        return (
          <BlockWrapper
            key={index}
            index={index}
            isContentReady={isContentReady}
          >
            <QuestionsBlock block={block} />
          </BlockWrapper>
        );
      case "theory":
        return (
          <BlockWrapper
            key={index}
            index={index}
            isContentReady={isContentReady}
          >
            <TheoryBlock block={block} />
          </BlockWrapper>
        );
      case "qna":
        return (
          <BlockWrapper
            key={index}
            index={index}
            isContentReady={isContentReady}
          >
            <QnABlock block={block} />
          </BlockWrapper>
        );
      case "practice":
        return (
          <BlockWrapper
            key={index}
            index={index}
            isContentReady={isContentReady}
          >
            <PracticeBlock block={block} />
          </BlockWrapper>
        );
      case "example":
        return (
          <BlockWrapper
            key={index}
            index={index}
            isContentReady={isContentReady}
          >
            <ExampleBlock block={block} />
          </BlockWrapper>
        );
      case "resources":
        return (
          <BlockWrapper
            key={index}
            index={index}
            isContentReady={isContentReady}
          >
            <ResourcesBlock
              block={block}
              lessonStatus={lessonStatus}
              onToggleCompleted={handleToggleCompleted}
            />
          </BlockWrapper>
        );
      default:
        return null;
    }
  };

  if (showLoader || isLoading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-text-primary-light dark:text-text-primary pt-20 flex flex-col animate-in fade-in duration-300">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light dark:border-primary"></div>
            <span className="ml-3 text-text-secondary-light dark:text-text-secondary">
              Загрузка темы...
            </span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-text-primary-light dark:text-text-primary pt-20 flex flex-col animate-in fade-in duration-300">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-text-secondary-light dark:text-text-secondary">
            Тема не найдена.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const typedLesson = lesson as LessonWithCategory;

  return (
    <>
      <div
        className={`min-h-screen bg-light-bg dark:bg-dark-bg text-text-primary-light dark:text-text-primary pt-20 flex flex-col transition-all duration-500 ease-in-out ${
          isNavigating ? "opacity-0" : "opacity-100"
        }`}
      >
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex-1">
          <Container className="py-2 sm:py-4">
            <div
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 transition-all duration-500 ease-in-out ${
                !isContentReady
                  ? "opacity-0 transform translate-y-4"
                  : "opacity-100 transform translate-y-0 animate-in fade-in slide-in-from-top-4 duration-300"
              }`}
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-tektur text-text-primary-light dark:text-text-primary order-2 sm:order-1">
                {`Тема ${typedLesson.id}: ${typedLesson.title}`}
              </h1>

              <div className="flex gap-1 sm:gap-2 order-1 sm:order-2 self-end sm:self-auto">
                {/* Кнопка "Главная" */}
                <button
                  onClick={handleBackClick}
                  disabled={isNavigating}
                  aria-label="Вернуться на главную страницу"
                  className={`inline-flex items-center px-2 py-1.5 sm:px-6 sm:py-3 text-sm sm:text-base text-light-bg dark:text-dark-bg font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light/50 dark:focus:ring-primary/50 btn-progress-animated-slow btn-progress-hover ${
                    isNavigating
                      ? "opacity-50 cursor-not-allowed transform scale-95"
                      : "hover:shadow-card-hover-light dark:hover:shadow-card-hover"
                  }`}
                >
                  <RiHomeLine className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Главная
                </button>

                {/* Кнопка "Назад" */}
                {prevLesson && (
                  <button
                    onClick={handlePrevClick}
                    disabled={isNavigating}
                    aria-label="Перейти к предыдущей теме"
                    className={`inline-flex items-center px-2 py-1.5 sm:px-6 sm:py-3 text-sm sm:text-base text-light-bg dark:text-dark-bg font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light/50 dark:focus:ring-primary/50 btn-progress-animated-slow btn-progress-hover ${
                      isNavigating
                        ? "opacity-50 cursor-not-allowed transform scale-95"
                        : "hover:shadow-card-hover-light dark:hover:shadow-card-hover"
                    }`}
                  >
                    <RiArrowLeftLine className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    Назад
                  </button>
                )}

                {/* Кнопка "Дальше" */}
                {nextLesson && (
                  <button
                    onClick={handleNextClick}
                    disabled={isNavigating}
                    aria-label="Перейти к следующей теме"
                    className={`inline-flex items-center px-2 py-1.5 sm:px-6 sm:py-3 text-sm sm:text-base text-light-bg dark:text-dark-bg font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light/50 dark:focus:ring-primary/50 btn-progress-animated-reverse-slow btn-progress-hover ${
                      isNavigating
                        ? "opacity-50 cursor-not-allowed transform scale-95"
                        : "hover:shadow-card-hover-light dark:hover:shadow-card-hover"
                    }`}
                  >
                    Дальше
                    <RiArrowRightLine className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>

            <div
              className={`space-y-4 lg:space-y-3 transition-all duration-500 ease-in-out ${
                !isContentReady
                  ? "opacity-0 transform scale-95"
                  : "opacity-100 transform scale-100"
              }`}
            >
              {typedLesson.blocks.map((block: LessonBlock, index: number) =>
                renderBlock(block, index)
              )}
            </div>
          </Container>
        </div>
        <Footer />
      </div>
      <ScrollToTop />
    </>
  );
};

export default LessonPage;
