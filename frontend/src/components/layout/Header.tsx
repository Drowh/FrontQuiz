// src/components/layout/Header.tsx
import { RiUserLine, RiSunLine, RiMoonLine } from "@remixicon/react";
import { Link, useLocation } from "react-router-dom";
import Container from "../common/Container";
import SearchInput from "../filters/SearchInput";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../common/NotificationManager";
import { useThemeStore } from "../../store/useThemeStore";
import { useSystemTheme } from "../../hooks/useSystemTheme";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header = ({ searchQuery, setSearchQuery }: HeaderProps) => {
  const location = useLocation();
  const { telegramId, setTelegramId } = useAuth();
  const { showNotification } = useNotification();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const { theme, setTheme } = useThemeStore();
  const systemTheme = useSystemTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutWarning(true);
    setIsDropdownOpen(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("telegram_id");
    setTelegramId(null);
    showNotification({
      type: "success",
      title: "Выход выполнен",
      message: "Вы успешно вышли из системы",
    });
    setShowLogoutWarning(false);
  };

  const cancelLogout = () => {
    setShowLogoutWarning(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      <header className="bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-border fixed top-0 left-0 right-0 z-20">
        <Container className="py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="hidden sm:block text-xl md:text-2xl font-new-rocker text-primary-light dark:text-primary mr-4 md:mr-8">
              FrontQuiz
            </h1>
            <Link
              to="/"
              className={`relative font-tektur text-text-primary-light dark:text-text-primary px-2 md:px-4 py-2 text-sm md:text-base transition-all duration-300 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-secondary-light dark:after:bg-secondary after:transition-all after:duration-300 hover:after:w-[80%] ${
                isActive("/") ? "after:w-[80%]" : ""
              }`}
            >
              <span className="sm:hidden mr-1">Все</span>
              <span className="hidden sm:inline">Все вопросы</span>
            </Link>
            <Link
              to="/quiz"
              className={`relative font-tektur text-text-primary-light dark:text-text-primary px-2 md:px-4 py-2 text-sm md:text-base transition-all duration-300 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-secondary-light dark:after:bg-secondary after:transition-all after:duration-300 hover:after:w-[80%] ${
                isActive("/quiz") ? "after:w-[80%]" : ""
              }`}
            >
              Тест
            </Link>
          </div>
          <div className="flex-1 justify-end max-w-[190px] xs:max-w-[280px] sm:max-w-none sm:w-auto flex items-center space-x-2 md:space-x-4 relative ml-1">
            {location.pathname !== "/quiz" && (
              <SearchInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
            {telegramId && (
              <button
                onClick={toggleDropdown}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-light-card dark:bg-dark-card text-primary-light dark:text-primary hover:bg-light-border dark:hover:bg-dark-border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-light/50 dark:focus:ring-primary/50 shrink-0"
                aria-label="Профиль пользователя"
              >
                <RiUserLine size={18} className="md:w-6 md:h-6" />
              </button>
            )}

            {isDropdownOpen && telegramId && (
              <div
                ref={dropdownRef}
                className="absolute top-12 md:top-12 right-0 w-40 md:w-48 bg-light-card dark:bg-dark-card rounded-md shadow-lg py-1 z-20 border border-light-border dark:border-dark-border"
              >
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm text-text-primary-light dark:text-text-primary hover:text-secondary-light dark:hover:text-secondary transition-colors duration-200"
                >
                  {isDark ? (
                    <>
                      <RiSunLine className="mr-2" size={16} />
                      Светлая тема
                    </>
                  ) : (
                    <>
                      <RiMoonLine className="mr-2" size={16} />
                      Темная тема
                    </>
                  )}
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm text-text-primary-light dark:text-text-primary hover:text-secondary-light dark:hover:text-secondary transition-colors duration-200"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        </Container>
      </header>

      {/* Модальное окно предупреждения */}
      {showLogoutWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-4 md:p-6 max-w-xs md:max-w-sm w-full shadow-xl">
            <h3 className="text-base md:text-lg font-tektur text-text-primary-light dark:text-text-primary mb-3 md:mb-4">
              Подтвердите выход
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary mb-4 md:mb-6 text-xs md:text-sm">
              Вы уверены, что хотите выйти из системы?
            </p>
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-md font-tektur text-xs md:text-sm transition-colors duration-200"
              >
                Выйти
              </button>
              <button
                onClick={cancelLogout}
                className="flex-1 bg-light-border dark:bg-dark-border hover:bg-light-sidebar dark:hover:bg-dark-sidebar text-text-primary-light dark:text-text-primary px-3 md:px-4 py-2 rounded-md font-tektur text-xs md:text-sm transition-colors duration-200"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
