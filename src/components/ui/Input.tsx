"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#a0a0b8]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b80]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-xl border bg-[#0f0f1a] px-4 py-2.5 text-sm text-white placeholder:text-[#6b6b80] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/30 focus:border-[#6c63ff] disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? "border-[#ff4d6d] focus:ring-[#ff4d6d]/30 focus:border-[#ff4d6d]"
                : "border-[#1e1e2e] hover:border-[#2e2e42]"
            } ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b80]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#ff4d6d] mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
