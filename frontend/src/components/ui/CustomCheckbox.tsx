import { memo, forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface CustomCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: "checkbox" | "radio";
  label?: string;
  error?: string;
}

const CustomCheckbox = memo(
  forwardRef<HTMLInputElement, CustomCheckboxProps>(
    (
      {
        type = "checkbox",
        checked,
        label,
        error,
        className = "",
        disabled,
        ...props
      },
      ref
    ) => {
      const inputId =
        props.id || `custom-${type}-${Math.random().toString(36).substr(2, 9)}`;

      return (
        <div className={`relative ${className}`}>
          <input
            ref={ref}
            id={inputId}
            type={type}
            checked={checked}
            disabled={disabled}
            className="w-5 h-5 opacity-0 absolute"
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={`
          flex items-center gap-2 cursor-pointer
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
          >
            <div
              className={`
            w-5 h-5 border-2 border-light-border dark:border-gray-600 
            ${type === "radio" ? "rounded-full" : "rounded"}
            ${
              checked
                ? "border-primary-light dark:border-primary"
                : "bg-transparent"
            }
            flex items-center justify-center
            ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
            transition-colors duration-200
          `}
            >
              {checked && type === "checkbox" && (
                <span className="text-text-primary-light dark:text-white text-xs font-bold">
                  ✓
                </span>
              )}
              {checked && type === "radio" && (
                <div className="w-2 h-2 bg-text-primary-light dark:bg-white rounded-full" />
              )}
            </div>
            {label && (
              <span className="text-sm text-text-primary-light dark:text-text-primary">
                {label}
              </span>
            )}
          </label>
          {error && (
            <span
              id={`${inputId}-error`}
              className="block mt-1 text-sm text-red-500"
              role="alert"
            >
              {error}
            </span>
          )}
        </div>
      );
    }
  )
);

CustomCheckbox.displayName = "CustomCheckbox";

export default CustomCheckbox;
