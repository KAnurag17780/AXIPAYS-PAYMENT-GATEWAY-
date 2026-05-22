"use client";

import { motion } from "framer-motion";
import { CreditCard, Lock } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#6c63ff] to-[#00d2ff] px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">
                    Card Payment
                  </h2>
                  <p className="text-white/70 text-xs">
                    Visa, Mastercard, Amex
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-white/70">
                <Lock className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">SSL Encrypted</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <CheckoutForm />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
