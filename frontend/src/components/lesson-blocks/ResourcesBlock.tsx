import React from "react";
import type { ResourcesBlockProps } from "./types";
import CustomSwitch from "../ui/CustomSwitch";
import CodeFormatter from "../utils/CodeFormatter";

const ResourcesBlock = ({
  block,
  lessonStatus = false,
  onToggleCompleted = () => {},
}: ResourcesBlockProps) => {
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-2xl sm:text-3xl font-tektur text-text-primary-light dark:text-text-primary">
          {block.title}
        </h2>
      </div>

      <ul className="list-disc pl-5 text-text-secondary-light dark:text-text-secondary space-y-2">
        {block.links.map((link, index) => (
          <li key={index} className="text-base sm:text-lg">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              <CodeFormatter text={link.text} />
            </a>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 self-end sm:self-auto justify-end">
        <CustomSwitch checked={lessonStatus} onChange={onToggleCompleted} />
        <span className="hidden sm:block text-base text-text-secondary-light dark:text-text-secondary w-28">
          {lessonStatus ? "Пройден" : "Не пройден"}
        </span>
      </div>
    </div>
  );
};

export default ResourcesBlock;
