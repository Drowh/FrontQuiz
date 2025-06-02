// src/components/ui/CustomSwitch.tsx
import { memo, useCallback } from "react";

interface CustomSwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const CustomSwitch = memo(
  ({
    checked,
    onChange,
    className = "",
    disabled = false,
    ariaLabel = "Переключатель",
  }: CustomSwitchProps) => {
    const handleChange = useCallback(() => {
      if (disabled) return;
      onChange?.(!checked);
    }, [checked, onChange, disabled]);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        handleChange();
      },
      [handleChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleChange();
        }
      },
      [handleChange]
    );

    return (
      <div
        className={`relative inline-flex items-center ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        } ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        tabIndex={disabled ? -1 : 0}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          readOnly
          disabled={disabled}
        />
        <span
          className={`w-10 h-5 bg-gray-200 dark:bg-dark-border rounded-full relative transition-all duration-300 ${
            checked ? "bg-primary-light/30 dark:bg-secondary" : ""
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-primary-light dark:bg-text-primary rounded-full transition-all duration-300 ${
              checked ? "translate-x-5" : ""
            }`}
          />
        </span>
      </div>
    );
  }
);

CustomSwitch.displayName = "CustomSwitch";

export default CustomSwitch;
