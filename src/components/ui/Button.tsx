"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants: Record<string, string> = {
      primary:
        "bg-gradient-to-r from-[#6c63ff] to-[#00d2ff] text-white hover:shadow-lg hover:shadow-[#6c63ff]/25 focus:ring-[#6c63ff]",
      secondary:
        "bg-[#13131f] text-white border border-[#1e1e2e] hover:bg-[#1a1a2e] focus:ring-[#6c63ff]",
      outline:
        "border border-[#1e1e2e] text-[#a0a0b8] hover:bg-white/5 hover:text-white focus:ring-[#6c63ff]",
      ghost:
        "text-[#a0a0b8] hover:bg-white/5 hover:text-white focus:ring-[#6c63ff]",
    };

    const sizes: Record<string, string> = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3.5 text-base gap-2.5",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {isLoading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-4 w-4" />
          </motion.span>
        ) : (
          leftIcon
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
