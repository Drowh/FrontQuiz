import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category } from "../types/lesson";
import { loadAllLessons, findLesson } from "./lessonLoader";

const LESSONS_CACHE_KEY = "lessons";
const LESSON_CACHE_KEY = (category: Category, id: number) =>
  `lesson-${category}-${id}`;

export function useLessons() {
  return useQuery({
    queryKey: [LESSONS_CACHE_KEY],
    queryFn: loadAllLessons,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 30 * 60 * 1000, // 30 минут
  });
}

export function useLesson(category: Category, id: number) {
  return useQuery({
    queryKey: [LESSON_CACHE_KEY(category, id)],
    queryFn: () => findLesson(category, id),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function usePrefetchLesson() {
  const queryClient = useQueryClient();

  return (category: Category, id: number) => {
    queryClient.prefetchQuery({
      queryKey: [LESSON_CACHE_KEY(category, id)],
      queryFn: () => findLesson(category, id),
    });
  };
}

export function usePrefetchAllLessons() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: [LESSONS_CACHE_KEY],
      queryFn: loadAllLessons,
    });
  };
}
