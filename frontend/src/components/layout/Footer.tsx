// src/components/layout/Footer.tsx
import Container from "../common/Container";
import { RiTelegramLine } from "@remixicon/react";

const Footer = () => {
  return (
    <footer className="bg-light-bg dark:bg-dark-bg py-6 border-t border-light-border dark:border-dark-border">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-new-rocker text-primary-light dark:text-primary mb-2">
              FrontQuiz
            </h2>
            <div className="text-text-secondary-light dark:text-text-secondary text-sm md:text-base">
              <p className="mb-1">
                База актуальных вопросов с собеседований по фронтенд-разработке
              </p>
              <p>© 2025 FrontQuiz. Все права защищены.</p>
            </div>
          </div>

          <div className="flex-1 md:flex-none md:text-right">
            <div className="flex items-center sm:flex-row sm:items-center gap-4 mb-3">
              <h3 className="text-base md:text-lg font-tektur text-text-primary-light dark:text-text-primary">
                Связаться с автором
              </h3>
              <a
                href="https://t.me/Drown1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-light-card dark:bg-dark-card text-primary-light dark:text-primary hover:bg-light-border dark:hover:bg-gray-700 transition-colors duration-200 self-start sm:self-auto"
                aria-label="Telegram"
              >
                <RiTelegramLine size={20} />
              </a>
            </div>
            <p className="text-text-secondary-light dark:text-text-secondary text-sm md:text-base">
              Нашли ошибку или хотите предложить улучшения? Напишите автору!
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
