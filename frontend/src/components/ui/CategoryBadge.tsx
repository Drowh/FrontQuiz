// src/components/ui/CategoryBadge.tsx
import { memo } from "react";

interface CategoryBadgeProps {
  label: string;
  className?: string;
}

const CategoryBadge = memo(({ label, className = "" }: CategoryBadgeProps) => {
  return (
    <span
      className={`inline-block bg-[#005645]/10 dark:bg-third/10 text-[#005645] dark:text-third text-xs px-2 py-1 rounded ${className}`}
      role="status"
      aria-label={`Категория: ${label}`}
    >
      {label}
    </span>
  );
});

CategoryBadge.displayName = "CategoryBadge";

export default CategoryBadge;
