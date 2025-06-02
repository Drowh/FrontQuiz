import { memo, type ReactNode } from "react";

interface BlockWrapperProps {
  children: ReactNode;
  index: number;
  isContentReady: boolean;
  className?: string;
  role?: string;
  "aria-label"?: string;
}

const ANIMATION_DELAY = 100;

const BlockWrapper = memo(
  ({
    children,
    index,
    isContentReady,
    className = "",
    role,
    "aria-label": ariaLabel,
  }: BlockWrapperProps) => {
    return (
      <section
        className={`animate-in fade-in slide-in-from-bottom-4 duration-300 ${className}`}
        style={{
          animationDelay: isContentReady
            ? `${index * ANIMATION_DELAY}ms`
            : "0ms",
        }}
        role={role}
        aria-label={ariaLabel}
      >
        {children}
      </section>
    );
  }
);

BlockWrapper.displayName = "BlockWrapper";

export default BlockWrapper;
