export interface BaseBlock {
  type: string;
  title: string;
}

export interface QuestionsBlock extends BaseBlock {
  type: "questions";
  questions: string[];
}

export interface TheoryBlock extends BaseBlock {
  type: "theory";
  content: string;
}

export interface QnABlock extends BaseBlock {
  type: "qna";
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export interface PracticeBlock extends BaseBlock {
  type: "practice";
  description: string[];
}

export interface ExampleBlock extends BaseBlock {
  type: "example";
  showCode: boolean;
  code?: string;
  codeType?: "html" | "html-snippet" | "css" | "javascript";
  explanation: string;
}

export interface ResourcesBlock extends BaseBlock {
  type: "resources";
  links: Array<{
    text: string;
    url: string;
  }>;
}

export type LessonBlock =
  | QuestionsBlock
  | TheoryBlock
  | QnABlock
  | PracticeBlock
  | ExampleBlock
  | ResourcesBlock;

export interface BlockProps {
  block: LessonBlock;
  lessonStatus?: boolean;
  onToggleCompleted?: (checked: boolean) => void;
}

export interface ResourcesBlockProps extends BlockProps {
  block: ResourcesBlock;
  lessonStatus: boolean;
  onToggleCompleted: (checked: boolean) => void;
}
