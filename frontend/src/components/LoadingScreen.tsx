import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onLoadingComplete,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoadingComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-dark-bg via-dark-card to-dark-sidebar animate-gradient">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 animate-spin-slow" />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-tl from-third/10 to-primary/10 animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "12s" }}
        />

        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-${i % 2 === 0 ? "2" : "1"} h-${
              i % 2 === 0 ? "2" : "1"
            } ${
              i % 3 === 0
                ? "bg-primary"
                : i % 3 === 1
                ? "bg-secondary"
                : "bg-third"
            } rounded-full animate-float`}
            style={{
              top: `${25 + i * 25}%`,
              left: `${25 + i * 25}%`,
              animationDelay: `${i}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8 animate-fade-in-up">
            <div className="relative inline-block">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-spin-slow" />
                <div
                  className="absolute inset-2 rounded-full border-3 border-secondary/40 animate-spin-slow"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "6s",
                  }}
                />
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary via-secondary to-third animate-pulse-glow flex items-center justify-center">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-light to-third-light dark:from-primary dark:to-third rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-light-bg dark:text-dark-bg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h1 className="text-5xl font-new-rocker text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-third mb-2">
              FrontQuiz
            </h1>
            <p className="text-text-secondary font-inter text-lg opacity-80">
              Проверь свои знания фронтенда
            </p>
          </div>

          <div
            className="mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="w-64 h-2 bg-dark-card rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-secondary to-third rounded-full animate-pulse"
                style={{ width: "100%", animationDuration: "2s" }}
              />
            </div>
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <p className="text-text-secondary font-tektur text-base flex items-center justify-center gap-1">
              <span>Загружаем квизы</span>
              <span className="flex gap-1 ml-1">
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 h-1 ${
                      i === 0
                        ? "bg-primary"
                        : i === 1
                        ? "bg-secondary"
                        : "bg-third"
                    } rounded-full animate-pulse`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </span>
            </p>
          </div>

          <div
            className="mt-8 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="flex items-center justify-center gap-4 text-text-secondary/60 text-sm font-inter">
              {["HTML", "CSS", "JavaScript"].map((tech, i) => (
                <span key={tech} className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 ${
                      i === 0
                        ? "bg-primary"
                        : i === 1
                        ? "bg-secondary"
                        : "bg-third"
                    } rounded-full animate-pulse`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
