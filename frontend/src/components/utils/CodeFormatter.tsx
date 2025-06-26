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

  const parseText = (inputText: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    let elementKey = 0;

    // Сначала обрабатываем блоки кода и заменяем их на плейсхолдеры
    const codeBlocksMap = new Map<string, React.ReactNode>();
    const codeBlockRegex = /```([a-zA-Z]*)\n?([\s\S]*?)\n?```/g;

    let textWithPlaceholders = inputText.replace(
      codeBlockRegex,
      (_match, lang, code) => {
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
      }
    );

    // Теперь обрабатываем остальные элементы, исключая плейсхолдеры
    const inlineCodeRegex = /`([^`\n]+)`/g;
    const htmlTagRegex = /<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^>]*)?\/?>/g;
    const boldTextRegex = /\*\*([^*]+)\*\*/g;
    const placeholderRegex = /__CODE_BLOCK_\d+__/g;

    // Создаем комбинированное регулярное выражение
    const combinedRegex = new RegExp(
      `(${placeholderRegex.source})|(${inlineCodeRegex.source})|(${htmlTagRegex.source})|(${boldTextRegex.source})`,
      "g"
    );

    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(textWithPlaceholders)) !== null) {
      const fullMatch = match[0];
      const matchStart = match.index!;
      const matchEnd = matchStart + fullMatch.length;

      // Добавляем текст перед совпадением
      if (matchStart > lastIndex) {
        const beforeText = textWithPlaceholders.substring(
          lastIndex,
          matchStart
        );
        if (beforeText) {
          elements.push(
            <React.Fragment key={`text-${elementKey++}`}>
              {beforeText}
            </React.Fragment>
          );
        }
      }

      // Обрабатываем совпадение по приоритету
      if (match[1] && codeBlocksMap.has(match[1])) {
        // Плейсхолдер блока кода - высший приоритет
        elements.push(codeBlocksMap.get(match[1])!);
      } else if (match[2]) {
        // Inline код
        const codeContent = match[2].substring(1, match[2].length - 1);
        elements.push(
          <code
            key={`inline-${elementKey++}`}
            className="bg-red-50 dark:bg-red-900/20 px-1 py-0.5 rounded text-red-600 dark:text-red-400 font-mono text-sm border border-red-200 dark:border-red-800/30 break-words whitespace-pre-wrap max-w-full inline-block"
          >
            {codeContent}
          </code>
        );
      } else if (match[3]) {
        // HTML тег
        elements.push(
          <code
            key={`html-${elementKey++}`}
            className="bg-red-50 dark:bg-red-900/20 px-1 py-0.5 rounded text-red-600 dark:text-red-400 font-mono text-sm border border-red-200 dark:border-red-800/30 break-words whitespace-pre-wrap max-w-full inline-block"
          >
            {match[3]}
          </code>
        );
      } else if (match[4]) {
        // Жирный текст
        const boldContent = match[4].substring(2, match[4].length - 2);
        elements.push(
          <strong key={`bold-${elementKey++}`} className="font-bold">
            {boldContent}
          </strong>
        );
      }

      lastIndex = matchEnd;
    }

    // Добавляем оставшийся текст
    if (lastIndex < textWithPlaceholders.length) {
      const remainingText = textWithPlaceholders.substring(lastIndex);
      if (remainingText) {
        // Проверяем, нет ли в оставшемся тексте плейсхолдеров
        const placeholderMatches = remainingText.match(placeholderRegex);
        if (placeholderMatches) {
          let currentPos = 0;
          placeholderMatches.forEach((placeholder) => {
            const placeholderIndex = remainingText.indexOf(
              placeholder,
              currentPos
            );

            // Добавляем текст перед плейсхолдером
            if (placeholderIndex > currentPos) {
              const beforePlaceholder = remainingText.substring(
                currentPos,
                placeholderIndex
              );
              elements.push(
                <React.Fragment key={`text-${elementKey++}`}>
                  {beforePlaceholder}
                </React.Fragment>
              );
            }

            // Добавляем блок кода
            if (codeBlocksMap.has(placeholder)) {
              elements.push(codeBlocksMap.get(placeholder)!);
            }

            currentPos = placeholderIndex + placeholder.length;
          });

          // Добавляем оставшийся текст после последнего плейсхолдера
          if (currentPos < remainingText.length) {
            elements.push(
              <React.Fragment key={`text-${elementKey++}`}>
                {remainingText.substring(currentPos)}
              </React.Fragment>
            );
          }
        } else {
          elements.push(
            <React.Fragment key={`text-${elementKey++}`}>
              {remainingText}
            </React.Fragment>
          );
        }
      }
    }

    // Если ничего не было обработано, возвращаем исходный текст
    if (elements.length === 0) {
      elements.push(
        <React.Fragment key={`full-text-0`}>
          {textWithPlaceholders}
        </React.Fragment>
      );
    }

    return elements;
  };

  const formattedText = parseText(text);

  return <>{formattedText}</>;
};

export default CodeFormatter;
