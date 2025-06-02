import React from "react";
import type { PracticeBlock as PracticeBlockType, BlockProps } from "./types";
import CodeFormatter from "../utils/CodeFormatter";

type PracticeBlockProps = BlockProps & {
  block: PracticeBlockType;
};

const PracticeBlock = ({ block }: PracticeBlockProps) => {
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg p-4 sm:p-5">
      <h2 className="text-2xl sm:text-3xl font-tektur text-primary-light dark:text-primary mb-2">
        {block.title}
      </h2>
      <ul className="list-disc pl-5 text-text-secondary-light dark:text-text-secondary space-y-1">
        {block.description.map((desc, dIndex) => (
          <li key={dIndex} className="text-base sm:text-lg">
            <CodeFormatter text={desc} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PracticeBlock;
