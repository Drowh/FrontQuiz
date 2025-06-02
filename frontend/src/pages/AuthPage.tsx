import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../components/common/NotificationManager";

function AuthPage() {
  const navigate = useNavigate();
  const { setTelegramId } = useAuth();
  const { showNotification } = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);
  const authProcessed = useRef(false);
  const notificationShown = useRef(false);

  useEffect(() => {
    // Предотвращаем повторное выполнение
    if (authProcessed.current) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      if (!notificationShown.current) {
        showNotification({
          type: "error",
          title: "Токен не найден",
          message: "Отсутствует токен авторизации в URL",
        });
        notificationShown.current = true;
      }
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    // Помечаем что начали обработку
    authProcessed.current = true;
    setIsProcessing(true);

    const handleAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem("telegram_id", data.telegram_id);
          setTelegramId(data.telegram_id);

          if (!notificationShown.current) {
            showNotification({
              type: "success",
              title: "Успешная авторизация",
              message:
                "Добро пожаловать! Перенаправляем на главную страницу...",
            });
            notificationShown.current = true;
          }

          // Очищаем URL от токена
          window.history.replaceState({}, document.title, "/auth");

          setTimeout(() => navigate("/"), 1500);
        } else {
          if (!notificationShown.current) {
            showNotification({
              type: "error",
              title: "Ошибка авторизации",
              message: data.message || "Неверный токен или срок действия истек",
            });
            notificationShown.current = true;
          }

          setTimeout(() => navigate("/"), 3000);
        }
      } catch (error) {
        if (!notificationShown.current) {
          showNotification({
            type: "error",
            title: "Ошибка соединения",
            message: "Не удалось подключиться к серверу. Попробуйте позже.",
          });
          notificationShown.current = true;
        }

        setTimeout(() => navigate("/"), 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuth();
  }, [navigate, setTelegramId, showNotification]); // Добавляем зависимости

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-bg">
      <div className="bg-dark-card p-8 rounded-xl border border-dark-border shadow-xl">
        <div className="flex flex-col items-center space-y-6">
          {/* Анимированный спиннер */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-dark-border rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>

          {/* Заголовок */}
          <div className="text-center">
            <h2 className="text-2xl font-tektur font-semibold text-text-primary mb-2">
              Авторизация
            </h2>
            <p className="text-lg text-text-secondary">
              {isProcessing ? "Проверяем токен..." : "Готово"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
