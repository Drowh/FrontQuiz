import type { QnABlock as QnABlockType, BlockProps } from "./types";
import CodeFormatter from "../utils/CodeFormatter";

type QnABlockProps = BlockProps & {
  block: QnABlockType;
};

const QnABlock = ({ block }: QnABlockProps) => {
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg p-4 sm:p-5">
      <h2 className="text-2xl sm:text-3xl font-tektur text-primary-light dark:text-primary mb-2">
        {block.title}
      </h2>
      {block.items.map((item, i) => (
        <div key={i} className="mb-4">
          <h3 className="text-lg sm:text-xl font-tektur text-text-primary-light dark:text-text-primary">
            🔸 <CodeFormatter text={item.question} />
          </h3>
          <div className="text-text-secondary-light dark:text-text-secondary text-base sm:text-lg">
            <CodeFormatter text={item.answer} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default QnABlock;
