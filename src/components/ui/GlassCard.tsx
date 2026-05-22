"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({
  children,
  className = "",
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              scale: 1.015,
              y: -2,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }
          : undefined
      }
      className={`glass rounded-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function GlassCardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`px-6 py-4 border-b border-white/5 ${className}`}
    >
      {children}
    </div>
  );
}

export function GlassCardContent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}
