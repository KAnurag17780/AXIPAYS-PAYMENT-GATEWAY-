"use client";

import { motion } from "framer-motion";

interface AnimatedBadgeProps {
  status: string;
  className?: string;
  delay?: number;
}

const statusStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  success: {
    bg: "rgba(0, 229, 160, 0.1)",
    text: "#00e5a0",
    border: "rgba(0, 229, 160, 0.3)",
    dot: "#00e5a0",
  },
  failed: {
    bg: "rgba(255, 77, 109, 0.1)",
    text: "#ff4d6d",
    border: "rgba(255, 77, 109, 0.3)",
    dot: "#ff4d6d",
  },
  pending: {
    bg: "rgba(255, 183, 3, 0.1)",
    text: "#ffb703",
    border: "rgba(255, 183, 3, 0.3)",
    dot: "#ffb703",
  },
};

export function AnimatedBadge({ status, className = "", delay = 0 }: AnimatedBadgeProps) {
  const normalized = status.toLowerCase();
  const style = statusStyles[normalized] || statusStyles.pending;

  return (
    <motion.span
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${className}`}
      style={{
        background: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: style.dot }}
      />
      {status}
    </motion.span>
  );
}
