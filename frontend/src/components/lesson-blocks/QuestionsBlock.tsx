import React from "react";
import type { QuestionsBlock as QuestionsBlockType, BlockProps } from "./types";
import CodeFormatter from "../utils/CodeFormatter";

type QuestionsBlockProps = BlockProps & {
  block: QuestionsBlockType;
};

const QuestionsBlock = ({ block }: QuestionsBlockProps) => {
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg p-4 sm:p-5">
      <h2 className="text-2xl sm:text-3xl font-tektur text-primary-light dark:text-primary mb-2">
        {block.title}
      </h2>
      <ul className="list-disc pl-5 text-text-secondary-light dark:text-text-secondary space-y-2">
        {block.questions.map((question, index) => (
          <li key={index} className="text-base sm:text-lg">
            <CodeFormatter text={question} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionsBlock;
