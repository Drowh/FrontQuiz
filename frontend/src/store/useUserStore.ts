import { create } from "zustand";

interface UserState {
  telegramId: string | null;
  setTelegramId: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  telegramId: null,
  setTelegramId: (id) => set({ telegramId: id }),
}));
