// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import Container from "../components/common/Container";
import LessonCard from "../components/lesson/LessonCard";
import Pagination from "../components/common/Pagination";
import AuthPrompt from "../components/AuthPrompt";
import { useLessonStore } from "../store/useLessonStore";
import { loadUserProgress } from "../utils/lessonLoader";
import { useAuth } from "../context/AuthContext";
import ScrollToTop from "../components/common/ScrollToTop";
import { useLessons, usePrefetchLesson } from "../utils/lessonCache";

const ITEMS_PER_PAGE = 10;

interface HomePageProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const HomePage = ({ searchQuery, setSearchQuery }: HomePageProps) => {
  const {
    lessons,
    setLessons,
    toggleCompleted,
    categoriesFilter,
    statusFilter,
  } = useLessonStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageTransition, setIsPageTransition] = useState(false);
  const { telegramId } = useAuth();
  const prefetchLesson = usePrefetchLesson();

  const { data: allLessons, isLoading } = useLessons();

  useEffect(() => {
    if (!telegramId || !allLessons) return;

    const fetchProgress = async () => {
      try {
        const userProgress = await loadUserProgress(telegramId);
        const lessonsWithProgress = allLessons.map((lesson) => {
          const progressMatch = userProgress.find(
            (p) => p.lesson_id === lesson.id && p.category === lesson.category
          );
          return {
            ...lesson,
            completed: progressMatch ? progressMatch.completed : false,
          };
        });
        setLessons(lessonsWithProgress);
      } catch (error) {
        console.error("Ошибка загрузки прогресса:", error);
      }
    };

    fetchProgress();
  }, [setLessons, telegramId, allLessons]);

  const filteredLessons = lessons.filter((lesson) => {
    const matchesCategory =
      categoriesFilter.length === 0 ||
      categoriesFilter.includes(lesson.category);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && lesson.completed) ||
      (statusFilter === "not_completed" && !lesson.completed);
    const matchesSearch =
      searchQuery === "" ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.motivation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredLessons.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLessons = filteredLessons.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setIsPageTransition(true);

    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        setIsPageTransition(false);
      }, 50);
    }, 150);
  };

  const handleLessonHover = (category: string, id: number) => {
    prefetchLesson(category as any, id);
  };

  if (!telegramId) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-text-primary-light dark:text-text-primary pt-20 flex flex-col animate-in fade-in duration-300">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex-1">
          <Container className="py-8">
            <AuthPrompt />
          </Container>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-text-primary-light dark:text-text-primary pt-20 flex flex-col animate-in fade-in duration-300">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex-1">
        <Container className="py-4">
          <div className="flex gap-2">
            <Sidebar />
            <main className="flex-1 md:ml-4 space-y-6 lg:space-y-4">
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isPageTransition || isLoading
                    ? "opacity-0 transform scale-95"
                    : "opacity-100 transform scale-100"
                }`}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light dark:border-primary"></div>
                    <span className="ml-3 text-text-secondary-light dark:text-text-secondary">
                      Загрузка...
                    </span>
                  </div>
                ) : paginatedLessons.length > 0 ? (
                  <div className="space-y-6">
                    {paginatedLessons.map((lesson, index) => (
                      <div
                        key={`${lesson.category}-${lesson.id}`}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onMouseEnter={() =>
                          handleLessonHover(lesson.category, lesson.id)
                        }
                      >
                        <LessonCard
                          index={lesson.id}
                          title={lesson.title}
                          description={lesson.motivation}
                          categories={[lesson.category]}
                          completed={lesson.completed || false}
                          onToggleCompleted={(completed) =>
                            toggleCompleted(
                              lesson.id,
                              completed,
                              telegramId || "",
                              lesson.category
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary-light dark:text-text-secondary text-center py-12">
                    Нет тем, соответствующих фильтру или поиску.
                  </p>
                )}
              </div>

              {totalPages > 1 && (
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    isPageTransition || isLoading
                      ? "opacity-0 transform translate-y-4"
                      : "opacity-100 transform translate-y-0"
                  }`}
                >
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </main>
          </div>
        </Container>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default HomePage;
