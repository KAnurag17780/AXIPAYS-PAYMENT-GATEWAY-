"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { PaymentStatusType } from "@/types/payment";

interface PaymentModalProps {
  status: PaymentStatusType;
  onClose: () => void;
  errorMessage?: string | null;
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    title: "Payment Successful!",
    message: "Your transaction has been processed successfully.",
    color: "#00e5a0",
    glow: "rgba(0, 229, 160, 0.2)",
  },
  failed: {
    icon: XCircle,
    title: "Payment Failed",
    message: "Your transaction could not be processed. Please try again.",
    color: "#ff4d6d",
    glow: "rgba(255, 77, 109, 0.2)",
  },
  pending: {
    icon: Clock,
    title: "Payment Pending",
    message: "Your transaction is being processed. You will be notified.",
    color: "#ffb703",
    glow: "rgba(255, 183, 3, 0.2)",
  },
};

export function PaymentModal({ status, onClose, errorMessage }: PaymentModalProps) {
  if (!status) return null;

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {status && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-[#13131f] border border-[#1e1e2e] rounded-2xl p-8"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 200,
                  delay: 0.1,
                }}
                className="p-4 rounded-full"
                style={{
                  background: config.glow,
                  boxShadow: `0 0 40px ${config.glow}`,
                }}
              >
                {status === "pending" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon className="h-12 w-12" style={{ color: config.color }} />
                  </motion.div>
                ) : (
                  <Icon className="h-12 w-12" style={{ color: config.color }} />
                )}
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-white"
              >
                {config.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-[#a0a0b8] max-w-xs"
              >
                {config.message}
                {status === "failed" && errorMessage && (
                  <div className="mt-2 text-xs text-[#ffb3bd]">{errorMessage}</div>
                )}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full pt-2"
              >
                <Button onClick={onClose} className="w-full" size="lg">
                  {status === "failed" ? "Try Again" : "Done"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
