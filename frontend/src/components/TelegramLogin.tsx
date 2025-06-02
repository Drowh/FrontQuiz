import { useEffect } from "react";

const TelegramLogin = () => {
  useEffect(() => {
    // Вставка Telegram Login Widget
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.setAttribute(
      "data-telegram-login",
      import.meta.env.VITE_TELEGRAM_BOT_USERNAME
    ); // без @
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "true");
    script.setAttribute("data-radius", "10");
    script.setAttribute(
      "data-auth-url",
      `${import.meta.env.VITE_API_URL}/auth/telegram`
    );
    script.setAttribute("data-request-access", "write");
    script.async = true;

    const container = document.getElementById("telegram-button");
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, []);

  return <div id="telegram-button"></div>;
};

export default TelegramLogin;
