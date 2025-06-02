function AuthPrompt() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md mx-auto">
        {/* Главная карточка */}
        <div className="bg-light-card dark:bg-dark-card p-4 rounded-xl border border-light-border dark:border-dark-border shadow-xl relative overflow-hidden">
          {/* Градиентный фон */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-secondary-light/5 dark:from-primary/5 dark:to-secondary/5 pointer-events-none"></div>

          <div className="relative z-10 text-center space-y-6">
            {/* Иконка */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-third-light dark:from-primary dark:to-third rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-light-bg dark:text-dark-bg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>

            {/* Заголовок */}
            <div>
              <h2 className="text-2xl font-tektur font-semibold text-text-primary-light dark:text-text-primary mb-3">
                Требуется авторизация
              </h2>
              <p className="text-text-secondary-light dark:text-text-secondary leading-relaxed">
                Для доступа к вопросам необходимо авторизоваться через Telegram
                бота
              </p>
            </div>

            {/* Инструкция */}
            <div className="bg-light-bg/50 dark:bg-dark-bg/50 p-4 rounded-lg border border-light-border dark:border-dark-border">
              <p className="text-text-secondary-light dark:text-text-secondary mb-4">
                Перейдите в бота и нажмите{" "}
                <span className="text-primary-light dark:text-primary font-mono">
                  /start
                </span>
              </p>

              {/* Кнопка */}
              <a
                href="https://t.me/checkSubOnFrontQuiz_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-primary-light to-third-light dark:from-primary dark:to-third text-light-bg dark:text-dark-bg font-semibold rounded-lg hover:shadow-card-hover-light dark:hover:shadow-card-hover transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light/50 dark:focus:ring-primary/50"
              >
                <svg
                  className="w-8 h-8 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Перейти к боту
              </a>
            </div>

            {/* Подсказка */}
            <div className="text-xs text-text-secondary-light/70 dark:text-text-secondary/70">
              После авторизации вы получите доступ ко всем материалам
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPrompt;
