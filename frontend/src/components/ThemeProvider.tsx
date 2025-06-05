import { useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { useSystemTheme } from "../hooks/useSystemTheme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useThemeStore();
  const systemTheme = useSystemTheme();

  useEffect(() => {
    const effectiveTheme = theme === "system" ? systemTheme : theme;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(effectiveTheme);
  }, [theme, systemTheme]);

  return <>{children}</>;
};
