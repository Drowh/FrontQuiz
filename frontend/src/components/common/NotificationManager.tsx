// src/components/common/NotificationManager.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  memo,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  RiCheckLine,
  RiCloseLine,
  RiErrorWarningLine,
  RiInformationLine,
} from "@remixicon/react";

const NOTIFICATION_TIMEOUT = 4000;
const MAX_NOTIFICATIONS = 5;

interface Notification {
  id: string;
  title: string;
  message?: string;
  type: "success" | "error" | "warning" | "info";
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, "id">) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification must be used within NotificationProvider");
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationIcon = memo(({ type }: { type: Notification["type"] }) => {
  switch (type) {
    case "success":
      return (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-third to-third-light flex items-center justify-center shadow-lg">
          <RiCheckLine className="w-5 h-5 text-white font-bold" />
        </div>
      );
    case "error":
      return (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
          <RiCloseLine className="w-5 h-5 text-white font-bold" />
        </div>
      );
    case "warning":
      return (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
          <RiErrorWarningLine className="w-5 h-5 text-white font-bold" />
        </div>
      );
    case "info":
      return (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg">
          <RiInformationLine className="w-5 h-5 text-white font-bold" />
        </div>
      );
  }
});

NotificationIcon.displayName = "NotificationIcon";

const getStyles = (type: Notification["type"]): string => {
  switch (type) {
    case "success":
      return "bg-light-card dark:bg-dark-card border-2 border-third/50 dark:border-third/50 shadow-xl";
    case "error":
      return "bg-light-card dark:bg-dark-card border-2 border-red-500/50 dark:border-red-500/50 shadow-xl";
    case "warning":
      return "bg-light-card dark:bg-dark-card border-2 border-yellow-500/50 dark:border-yellow-500/50 shadow-xl";
    case "info":
      return "bg-light-card dark:bg-dark-card border-2 border-primary/40 dark:border-primary/50 shadow-xl";
  }
};

const getAccentBar = (type: Notification["type"]): string => {
  switch (type) {
    case "success":
      return "bg-gradient-to-r from-third to-third-light";
    case "error":
      return "bg-gradient-to-r from-red-500 to-red-600";
    case "warning":
      return "bg-gradient-to-r from-yellow-500 to-orange-500";
    case "info":
      return "bg-gradient-to-r from-primary to-primary-light";
  }
};

const NotificationItem = memo(
  ({
    notification,
    onRemove,
  }: {
    notification: Notification;
    onRemove: (id: string) => void;
  }) => (
    <div
      className={`
        relative overflow-hidden rounded-xl mb-3 p-4
        transform transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-2xl
        animate-fade-in-up backdrop-blur-sm
        ${getStyles(notification.type)}
      `}
    >
      {/* Цветная полоска слева */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${getAccentBar(
          notification.type
        )}`}
      />

      {/* Основное содержимое */}
      <div className="flex items-start ml-2">
        <div className="flex-shrink-0 mr-4">
          <NotificationIcon type={notification.type} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary mb-1">
            {notification.title}
          </h3>
          {notification.message && (
            <p className="text-sm text-text-secondary-light dark:text-text-secondary leading-relaxed">
              {notification.message}
            </p>
          )}
        </div>

        <button
          onClick={() => onRemove(notification.id)}
          className="
            flex-shrink-0 ml-4 p-2 rounded-lg
            text-text-secondary-light dark:text-text-secondary
            hover:text-text-primary-light dark:hover:text-text-primary
            hover:bg-light-border/10 dark:hover:bg-dark-border/10
            transition-all duration-200
            transform hover:scale-110
          "
        >
          <RiCloseLine className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
);

NotificationItem.displayName = "NotificationItem";

type Theme = "light" | "dark";

export const NotificationProvider: React.FC<NotificationProviderProps> = memo(
  ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [theme, setTheme] = useState<Theme>(() => {
      if (typeof window !== "undefined") {
        return document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";
      }
      return "light";
    });

    useEffect(() => {
      const observer = new MutationObserver(() => {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "dark" : "light");
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }, []);

    const showNotification = useCallback(
      async (notification: Omit<Notification, "id">) => {
        const isDuplicate = notifications.some(
          (n) =>
            n.title === notification.title && n.message === notification.message
        );

        if (isDuplicate) return;

        await new Promise((resolve) => setTimeout(resolve, 100));

        const id = uuidv4();
        const newNotification = { ...notification, id };

        setNotifications((prev) => {
          const updated = [...prev, newNotification];
          return updated.slice(-MAX_NOTIFICATIONS);
        });

        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, NOTIFICATION_TIMEOUT);
      },
      [notifications]
    );

    const removeNotification = useCallback((id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
      <NotificationContext.Provider value={{ showNotification }}>
        {children}
        <div className="fixed top-4 right-4 z-50 w-80 md:w-96">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <NotificationItem
                notification={notification}
                onRemove={removeNotification}
              />
            </div>
          ))}
        </div>
      </NotificationContext.Provider>
    );
  }
);

NotificationProvider.displayName = "NotificationProvider";
