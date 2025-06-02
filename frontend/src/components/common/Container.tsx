import { memo, type ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = memo(({ children, className = "" }: ContainerProps) => {
  return (
    <div
      className={`mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-12 ${className}`}
    >
      {children}
    </div>
  );
});

Container.displayName = "Container";

export default Container;
