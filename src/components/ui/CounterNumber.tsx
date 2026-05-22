"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface CounterNumberProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function CounterNumber({
  value,
  duration = 1.5,
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
}: CounterNumberProps) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });
  const [displayValue, setDisplayValue] = useState("0");
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (value > 0 && !hasAnimated.current) {
      hasAnimated.current = true;
      motionValue.set(value);
    } else if (value > 0) {
      motionValue.set(value);
    }
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      const formatted = decimals > 0
        ? latest.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : Math.floor(latest).toLocaleString();
      setDisplayValue(formatted);
    });
    return unsubscribe;
  }, [springValue, decimals]);

  return (
    <motion.span className={`tabular-nums ${className}`}>
      {prefix}{displayValue}{suffix}
    </motion.span>
  );
}
