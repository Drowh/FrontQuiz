import { useState, useEffect, useRef } from "react";
import {
  RiCodeLine,
  RiEyeLine,
  RiTerminalLine,
  RiFileCopyLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiCloseLine,
  RiCheckLine,
} from "@remixicon/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { ExampleBlock as ExampleBlockType, BlockProps } from "./types";
import CodeFormatter from "../utils/CodeFormatter";

type ExampleBlockProps = BlockProps & {
  block: ExampleBlockType;
};

type ViewMode = "code" | "preview";
type CodeType = "html" | "html-snippet" | "css" | "javascript";

const ExampleBlock = ({ block }: ExampleBlockProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("code");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Отслеживаем изменения темы
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

  // Определяем тип кода для правильной обработки
  const getCodeType = (): CodeType => {
    if (!block.code) return "html";

    // Используем явно указанный тип, если он есть
    if (block.codeType) return block.codeType;

    if (block.code.includes("<html") || block.code.includes("<!DOCTYPE")) {
      return "html";
    }
    if (block.code.includes("<") && block.code.includes(">")) {
      return "html";
    }
    if (
      block.code.includes("console.") ||
      block.code.includes("function") ||
      block.code.includes("const") ||
      block.code.includes("let")
    ) {
      return "javascript";
    }
    return "css";
  };

  const codeType = getCodeType();

  // Получаем язык для SyntaxHighlighter
  const getSyntaxLanguage = () => {
    switch (codeType) {
      case "html":
      case "html-snippet":
        return "html";
      case "css":
        return "css";
      case "javascript":
        return "javascript";
      default:
        return "html";
    }
  };

  // Получаем стиль для подсветки синтаксиса в зависимости от темы
  const getSyntaxStyle = () => {
    return isDarkMode ? vscDarkPlus : vs;
  };

  // Получаем фоновый цвет для подсветки синтаксиса
  const getSyntaxBackground = () => {
    return isDarkMode ? "#03031e" : "#f8f9fa";
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const copyToClipboard = async () => {
    if (block.code) {
      try {
        await navigator.clipboard.writeText(block.code);
        setIsCopied(true);
      } catch (err) {
        console.error("Ошибка копирования:", err);
      }
    }
  };

  // Скрипт для перехвата консоли - выносим в отдельную функцию
  const getConsoleInterceptorScript = () => {
    return `
      <script>
        (function() {
          // Перехватываем console.log и другие методы
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;
          
          function sendToParent(message, type = 'log') {
            const timestamp = new Date().toLocaleTimeString();
            const prefix = type === 'error' ? '❌ ' : type === 'warn' ? '⚠️ ' : '📝 ';
            const logMessage = prefix + message;
            
            // Отправляем в родительское окно для консоли
            window.parent.postMessage({
              type: 'console-' + type,
              message: logMessage,
              timestamp: timestamp
            }, '*');
          }
          
          console.log = function(...args) {
            originalLog.apply(console, args);
            sendToParent(args.join(' '), 'log');
          };
          
          console.error = function(...args) {
            originalError.apply(console, args);
            sendToParent(args.join(' '), 'error');
          };
          
          console.warn = function(...args) {
            originalWarn.apply(console, args);
            sendToParent(args.join(' '), 'warn');
          };
          
          // Перехватываем ошибки
          window.onerror = function(message, source, lineno, colno, error) {
            sendToParent('Ошибка: ' + message + ' (строка ' + lineno + ')', 'error');
            return true;
          };
          
          window.addEventListener('unhandledrejection', function(event) {
            sendToParent('Promise rejected: ' + event.reason, 'error');
          });
        })();
      </script>
    `;
  };

  // Создаем HTML для предварительного просмотра с улучшенной консолью
  const createPreviewHTML = () => {
    if (!block.code) return "<html><body><p>Код не найден</p></body></html>";

    const bgColor = "#ffffff";
    const textColor = "#1a1a1a";
    const cardBg = isDarkMode ? "#161626" : "#f8f9fa";

    // Проверяем, содержит ли код JavaScript (в любом виде)
    const hasJavaScript =
      block.code.includes("console.") ||
      block.code.includes("<script>") ||
      block.code.includes("function") ||
      block.code.includes("let ") ||
      block.code.includes("const ") ||
      block.code.includes("var ");

    if (codeType === "html") {
      // Если это полноценная HTML страница и содержит JavaScript
      if (hasJavaScript) {
        // Инжектируем скрипт перехвата консоли в head
        let modifiedHTML = block.code;
        const headCloseIndex = modifiedHTML.indexOf("</head>");

        if (headCloseIndex !== -1) {
          // Вставляем скрипт перед закрывающим тегом head
          modifiedHTML =
            modifiedHTML.slice(0, headCloseIndex) +
            getConsoleInterceptorScript() +
            modifiedHTML.slice(headCloseIndex);
        } else {
          // Если нет head, добавляем в начало body
          const bodyIndex = modifiedHTML.indexOf("<body>");
          if (bodyIndex !== -1) {
            modifiedHTML =
              modifiedHTML.slice(0, bodyIndex + 6) +
              getConsoleInterceptorScript() +
              modifiedHTML.slice(bodyIndex + 6);
          } else {
            // Если нет структуры, оборачиваем
            modifiedHTML = `<html><head>${getConsoleInterceptorScript()}</head><body>${modifiedHTML}</body></html>`;
          }
        }

        return modifiedHTML;
      }

      // Если нет JavaScript, возвращаем как есть
      return block.code;
    }

    if (codeType === "javascript") {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          ${getConsoleInterceptorScript()}
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              background: ${bgColor}; 
              color: ${textColor}; 
              margin: 0;
            }
            .output { 
              background: ${cardBg}; 
              padding: 15px; 
              border-radius: 8px; 
              margin: 10px 0; 
              min-height: 50px;
            }
            .output h3 {
              margin: 0 0 10px 0;
              color: #666;
              font-size: 14px;
            }
            #result {
              font-family: 'Courier New', monospace;
              white-space: pre-wrap;
              color: #333;
            }
          </style>
        </head>
        <body>
          <div class="output">
            <h3>Результат выполнения:</h3>
            <div id="result"></div>
          </div>
          <script>
            try {
              ${block.code}
            } catch (error) {
              console.error('Ошибка выполнения: ' + error.message);
            }
          </script>
        </body>
        </html>
      `;
    }

    // Для CSS или HTML-сниппетов
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: ${bgColor}; 
            color: ${textColor}; 
            margin: 0;
          }
          ${codeType === "css" ? block.code : ""}
        </style>
      </head>
      <body>
        ${
          ["html", "html-snippet"].includes(codeType)
            ? block.code
            : `
          <div class="demo-content">
            <h2>Демонстрация CSS</h2>
            <p>Этот блок демонстрирует применение CSS стилей.</p>
            <div class="example-box">Пример блока</div>
          </div>
        `
        }
      </body>
      </html>
    `;
  };

  // Обработчик сообщений от iframe для консоли
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type?.startsWith("console-")) {
        const logEntry = `[${event.data.timestamp}] ${event.data.message}`;
        setConsoleLogs((prev) => [...prev, logEntry]);

        // Автоматически открываем консоль при новых логах (если есть JavaScript)
        const hasJS =
          block.code &&
          (block.code.includes("console.") ||
            block.code.includes("<script>") ||
            codeType === "javascript");

        if (hasJS && viewMode === "preview") {
          setIsConsoleOpen(true);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [block.code, codeType, viewMode]);

  // Очищаем консоль при смене кода или режима
  useEffect(() => {
    setConsoleLogs([]);
  }, [block.code, viewMode]);

  // Обновляем iframe при смене темы
  useEffect(() => {
    if (iframeRef.current && viewMode === "preview") {
      iframeRef.current.srcdoc = createPreviewHTML();
    }
  }, [isDarkMode, viewMode]);

  // Проверяем, есть ли JavaScript в коде
  const hasJavaScriptContent = () => {
    return (
      block.code &&
      (block.code.includes("console.") ||
        block.code.includes("<script>") ||
        block.code.includes("function") ||
        block.code.includes("let ") ||
        block.code.includes("const ") ||
        block.code.includes("var ") ||
        codeType === "javascript")
    );
  };

  const getActiveButtonClass = (mode: ViewMode) => {
    return viewMode === mode
      ? "bg-primary-light dark:bg-primary text-light-bg dark:text-dark-bg"
      : "bg-light-card dark:bg-dark-card text-text-secondary-light dark:text-text-secondary hover:bg-light-border dark:hover:bg-gray-700 hover:text-text-primary-light dark:hover:text-text-primary";
  };

  const toggleConsole = () => {
    setIsConsoleOpen(!isConsoleOpen);
  };

  const clearConsole = () => {
    setConsoleLogs([]);
  };

  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg p-4 sm:p-5 relative">
      <h2 className="text-2xl sm:text-3xl font-tektur text-primary-light dark:text-primary mb-4">
        {block.title}
      </h2>

      {/* Переключатели режимов просмотра - УБРАНА КНОПКА КОНСОЛЬ */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setViewMode("code")}
          className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 ${getActiveButtonClass(
            "code"
          )}`}
        >
          <RiCodeLine className="mr-2" size={16} />
          Код
        </button>

        {(codeType === "html" ||
          codeType === "html-snippet" ||
          codeType === "css" ||
          codeType === "javascript") && (
          <button
            onClick={() => setViewMode("preview")}
            className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 ${getActiveButtonClass(
              "preview"
            )}`}
          >
            <RiEyeLine className="mr-2" size={16} />
            Предпросмотр
          </button>
        )}

        {viewMode === "code" && block.code && (
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-sm sm:text-base font-semibold bg-light-card dark:bg-dark-card text-text-secondary-light dark:text-text-secondary hover:bg-light-border dark:hover:bg-gray-700 hover:text-text-primary-light dark:hover:text-text-primary transition-all duration-200"
          >
            {isCopied ? (
              <RiCheckLine className="mr-2 text-green-500" size={16} />
            ) : (
              <RiFileCopyLine className="mr-2" size={16} />
            )}
            Копировать
          </button>
        )}
      </div>

      {/* Контент */}
      <div className="mt-4 relative">
        {viewMode === "code" && block.code && (
          <div className="relative">
            <SyntaxHighlighter
              language={getSyntaxLanguage()}
              style={getSyntaxStyle()}
              customStyle={{
                margin: 0,
                borderRadius: "0.5rem",
                background: getSyntaxBackground(),
                padding: "1rem",
                border: isDarkMode ? "1px solid #333" : "1px solid #ccc",
                overflowX: "auto",
              }}
            >
              {block.code}
            </SyntaxHighlighter>
          </div>
        )}

        {viewMode === "preview" && (
          <div className="relative">
            {/* ИСПРАВЛЕН КОНТЕЙНЕР ПРЕДПРОСМОТРА */}
            <div className="border border-light-border dark:border-dark-border rounded-lg overflow-hidden relative">
              <iframe
                ref={iframeRef}
                srcDoc={createPreviewHTML()}
                className="w-full h-[400px] bg-white"
                title="Preview"
              />

              {/* ИСПРАВЛЕНА КОНСОЛЬ - теперь внутри контейнера iframe */}
              {hasJavaScriptContent() && (
                <div className="absolute bottom-0 left-0 right-0">
                  {/* Кнопка консоли */}
                  <div className="flex justify-center">
                    <button
                      onClick={toggleConsole}
                      className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        isConsoleOpen
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                          : "bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
                      }`}
                      style={{
                        transform: isConsoleOpen
                          ? "translateY(0)"
                          : "translateY(2px)",
                      }}
                    >
                      <RiTerminalLine size={16} />
                      Консоль
                      {consoleLogs.length > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {consoleLogs.length}
                        </span>
                      )}
                      {isConsoleOpen ? (
                        <RiArrowDownSLine size={16} />
                      ) : (
                        <RiArrowUpSLine size={16} />
                      )}
                    </button>
                  </div>

                  {/* ИСПРАВЛЕНА ПАНЕЛЬ КОНСОЛИ - ограничена высотой iframe */}
                  <div
                    className={`bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 transition-all duration-300 ease-in-out ${
                      isConsoleOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
                    style={{
                      height: isConsoleOpen ? "300px" : "0px",
                      maxHeight: "300px",
                      transform: isConsoleOpen
                        ? "translateY(0)"
                        : "translateY(100%)",
                    }}
                  >
                    <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                        Консоль ({consoleLogs.length} записей)
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={clearConsole}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm px-2 py-1 rounded"
                        >
                          Очистить
                        </button>
                        <button
                          onClick={toggleConsole}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                          <RiCloseLine size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 h-full overflow-y-auto font-mono text-sm">
                      {consoleLogs.length === 0 ? (
                        <div className="text-gray-500 dark:text-gray-400">
                          Консоль пуста
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {consoleLogs.map((log, index) => (
                            <div
                              key={index}
                              className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
                            >
                              {log}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Добавляем блок с объяснением */}
      {block.explanation && (
        <div className="mt-4 p-4 bg-light-card dark:bg-dark-card rounded-lg border border-light-border dark:border-dark-border">
          <p className="text-text-secondary-light dark:text-text-secondary">
            ⚠️ Объяснение:{" "}
            <CodeFormatter
              text={block.explanation.replace("⚠️ Объяснение:", "").trim()}
            />
          </p>
        </div>
      )}
    </div>
  );
};

export default ExampleBlock;
