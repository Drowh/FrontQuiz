import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  telegramId: string | null;
  setTelegramId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [telegramId, setTelegramIdState] = useState<string | null>(() => {
    const savedId = localStorage.getItem("telegram_id");
    return savedId || null;
  });

  const setTelegramId = (id: string | null) => {
    setTelegramIdState(id);
    if (id) {
      localStorage.setItem("telegram_id", id);
    } else {
      localStorage.removeItem("telegram_id");
    }
  };

  useEffect(() => {
    const savedId = localStorage.getItem("telegram_id");
    if (savedId) {
      setTelegramIdState(savedId);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ telegramId, setTelegramId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
