"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[#a0a0b8]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none rounded-xl border bg-[#0f0f1a] px-4 py-2.5 pr-10 text-sm text-white transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/30 focus:border-[#6c63ff] disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? "border-[#ff4d6d] focus:ring-[#ff4d6d]/30 focus:border-[#ff4d6d]"
                : "border-[#1e1e2e] hover:border-[#2e2e42]"
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b80] pointer-events-none" />
        </div>
        {error && <p className="text-xs text-[#ff4d6d] mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
export type { SelectOption };
