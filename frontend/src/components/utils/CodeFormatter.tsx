import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeFormatterProps {
  text: string;
}

const CodeFormatter: React.FC<CodeFormatterProps> = ({ text }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const syntaxStyle = isDarkMode ? vscDarkPlus : vs;
  const syntaxBackground = isDarkMode ? "#03031e" : "#f8f9fa";

  // Функция для обработки текста с поддержкой блоков кода, inline-кода и HTML-тегов
  const parseText = (inputText: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];

    // Регулярные выражения
    const codeBlockRegex = /```([a-zA-Z]*)\n?([\s\S]*?)\n?```/g;
    const inlineCodeRegex = /`([^`\n]+)`/g;
    // Добавляем регулярное выражение для HTML-тегов
    const htmlTagRegex = /<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^>]*)?\/?>/g;
    const boldTextRegex = /\*\*([^*]+)\*\*/g;

    let currentText = inputText;
    let elementKey = 0;

    // Сохраняем информацию о блоках кода
    const codeBlocksMap = new Map<string, React.ReactNode>();

    currentText = currentText.replace(codeBlockRegex, (_match, lang, code) => {
      const language = lang?.trim() || "text";
      const codeContent = code?.trim() || "";
      const placeholder = `__CODE_BLOCK_${elementKey}__`;

      codeBlocksMap.set(
        placeholder,
        <div
          key={`block-${elementKey}`}
          className="my-2 rounded-lg overflow-hidden"
          style={{
            border: isDarkMode ? "1px solid #333" : "1px solid #ccc",
          }}
        >
          <SyntaxHighlighter
            language={language}
            style={syntaxStyle}
            customStyle={{
              margin: 0,
              borderRadius: "0.5rem",
              background: syntaxBackground,
              padding: "1rem",
              overflowX: "auto",
              fontSize: "0.875rem",
            }}
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
      );

      elementKey++;
      return placeholder;
    });

    // Теперь разбиваем текст на части, учитывая все типы форматирования
    const allRegex = new RegExp(
      `(${inlineCodeRegex.source})|(${htmlTagRegex.source})|(${boldTextRegex.source})|(__CODE_BLOCK_\d+__)`,
      "g"
    );

    let lastIndex = 0;
    let match;

    while ((match = allRegex.exec(currentText)) !== null) {
      const fullMatch = match[0];
      const matchStart = match.index!;
      const matchEnd = matchStart + fullMatch.length;

      // Добавляем текст перед совпадением
      if (matchStart > lastIndex) {
        elements.push(
          <React.Fragment key={`text-${elementKey++}`}>
            {currentText.substring(lastIndex, matchStart)}
          </React.Fragment>
        );
      }

      // Обрабатываем совпадение
      if (fullMatch.startsWith("`__CODE_BLOCK_")) {
        // Исправляем проверку плейсхолдера
        // Это плейсхолдер блока кода
        const placeholder = fullMatch; // Плейсхолдер уже содержит `
        // Если полный матч начинается с `` ` то извлекаем плейсхолдер из него
        const actualPlaceholder =
          fullMatch.startsWith("`") && fullMatch.endsWith("`")
            ? fullMatch.substring(1, fullMatch.length - 1)
            : fullMatch;

        const codeElement = codeBlocksMap.get(actualPlaceholder);
        if (codeElement) {
          elements.push(codeElement);
        } else {
          // Fallback если плейсхолдер не найден (не должен происходить)
          elements.push(
            <React.Fragment key={`text-fallback-${elementKey++}`}>
              {fullMatch}
            </React.Fragment>
          );
        }
      } else if (fullMatch.startsWith("`") && fullMatch.endsWith("`")) {
        // Это inline-код
        const codeContent =
          match[5] || fullMatch.substring(1, fullMatch.length - 1); // Используем группу захвата или обрезаем `
        elements.push(
          <code
            key={`inline-${elementKey++}`}
            className="bg-red-50 dark:bg-red-900/20 px-1 py-0.5 rounded text-red-600 dark:text-red-400 font-mono text-sm border border-red-200 dark:border-red-800/30 break-words whitespace-pre-wrap max-w-full inline-block"
          >
            {codeContent}
          </code>
        );
      } else if (fullMatch.startsWith("<") && fullMatch.endsWith(">")) {
        // Это HTML-тег
        elements.push(
          <code
            key={`html-${elementKey++}`}
            className="bg-red-50 dark:bg-red-900/20 px-1 py-0.5 rounded text-red-600 dark:text-red-400 font-mono text-sm border border-red-200 dark:border-red-800/30 break-words whitespace-pre-wrap max-w-full inline-block"
          >
            {fullMatch}
          </code>
        );
      } else if (fullMatch.startsWith("**") && fullMatch.endsWith("**")) {
        // Это жирный текст
        const boldContent =
          match[7] || fullMatch.substring(2, fullMatch.length - 2); // Используем группу захвата или обрезаем **
        elements.push(
          <strong key={`bold-${elementKey++}`} className="font-bold">
            {boldContent}
          </strong>
        );
      } else {
        // Неизвестное совпадение, добавляем как обычный текст
        elements.push(
          <React.Fragment key={`unknown-match-${elementKey++}`}>
            {fullMatch}
          </React.Fragment>
        );
      }

      lastIndex = matchEnd;
    }

    // Добавляем оставшийся текст после последнего совпадения
    if (lastIndex < currentText.length) {
      elements.push(
        <React.Fragment key={`text-${elementKey++}`}>
          {currentText.substring(lastIndex)}
        </React.Fragment>
      );
    }

    // Если совпадений не было, добавляем весь исходный текст как один элемент
    if (elements.length === 0 && currentText.length > 0) {
      elements.push(
        <React.Fragment key={`full-text-${elementKey++}`}>
          {currentText}
        </React.Fragment>
      );
    }

    return elements;
  };

  // Обработка переносов строк для корректного отображения в React
  const formattedText = parseText(text);

  return <>{formattedText}</>;
};

export default CodeFormatter;
