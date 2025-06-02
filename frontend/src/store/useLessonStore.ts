// src/store/useLessonStore.ts
import { create } from "zustand";
import type { LessonWithCategory } from "../types/lesson";
import { updateUserProgress } from "../utils/lessonLoader";

interface LessonState {
  lessons: LessonWithCategory[];
  categoriesFilter: string[];
  statusFilter: "all" | "completed" | "not_completed";
  setLessons: (lessons: LessonWithCategory[]) => void;
  toggleCompleted: (
    id: number,
    completed: boolean,
    telegramId: string,
    category: string
  ) => void;
  setCategoriesFilter: (categories: string[]) => void;
  setStatusFilter: (status: "all" | "completed" | "not_completed") => void;
}

const pendingUpdates = new Set<string>();

export const useLessonStore = create<LessonState>((set, get) => ({
  lessons: [],
  categoriesFilter: [],
  statusFilter: "all",
  setLessons: (lessons) => set({ lessons }),
  toggleCompleted: (id, completed, telegramId, category) => {
    const updateKey = `${telegramId}-${id}-${category}`;

    if (pendingUpdates.has(updateKey)) return;
    pendingUpdates.add(updateKey);

    const currentLessons = get().lessons;
    const currentLesson = currentLessons.find(
      (l) => l.id === id && l.category === category
    );

    if (!currentLesson) {
      console.error("Lesson not found:", { id, category });
      pendingUpdates.delete(updateKey);
      return;
    }

    if (currentLesson.completed === completed) {
      pendingUpdates.delete(updateKey);
      return;
    }

    set((state) => ({
      lessons: state.lessons.map((lesson) =>
        lesson.id === id && lesson.category === category
          ? { ...lesson, completed }
          : lesson
      ),
    }));

    if (telegramId) {
      updateUserProgress(telegramId, id, category, completed)
        .catch((error) => {
          console.error("Server update failed:", error);
          set((state) => ({
            lessons: state.lessons.map((lesson) =>
              lesson.id === id && lesson.category === category
                ? { ...lesson, completed: !completed }
                : lesson
            ),
          }));
        })
        .finally(() => {
          pendingUpdates.delete(updateKey);
        });
    } else {
      pendingUpdates.delete(updateKey);
    }
  },
  setCategoriesFilter: (categories) => set({ categoriesFilter: categories }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
