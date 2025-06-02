import React from "react";
import type { TheoryBlock as TheoryBlockType, BlockProps } from "./types";
import CodeFormatter from "../utils/CodeFormatter";

type TheoryBlockProps = BlockProps & {
  block: TheoryBlockType;
};

const TheoryBlock = ({ block }: TheoryBlockProps) => {
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg p-4 sm:p-5">
      <h2 className="text-2xl sm:text-3xl font-tektur text-primary-light dark:text-primary mb-2">
        {block.title}
      </h2>
      <p className="text-text-secondary-light dark:text-text-secondary text-base sm:text-lg">
        <CodeFormatter text={block.content} />
      </p>
    </div>
  );
};

export default TheoryBlock;
