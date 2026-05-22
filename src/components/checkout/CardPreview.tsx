"use client";

import { motion } from "framer-motion";
import { detectCardBrand } from "@/lib/luhn";

interface CardPreviewProps {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isFlipped: boolean;
}

function CardBrandIcon({ brand }: { brand: string }) {
  if (brand === "visa") {
    return (
      <svg viewBox="0 0 48 16" className="h-6 w-auto" fill="white">
        <text x="0" y="14" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily="sans-serif">VISA</text>
      </svg>
    );
  }
  if (brand === "mastercard") {
    return (
      <div className="flex items-center gap-[-4px]">
        <div className="w-5 h-5 rounded-full bg-red-500 opacity-80" />
        <div className="w-5 h-5 rounded-full bg-yellow-500 opacity-80 -ml-2" />
      </div>
    );
  }
  if (brand === "amex") {
    return (
      <svg viewBox="0 0 48 16" className="h-5 w-auto" fill="white">
        <text x="0" y="13" fontSize="10" fontWeight="bold" fontFamily="sans-serif">AMEX</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 16" className="h-5 w-auto" fill="white" opacity="0.5">
      <text x="0" y="13" fontSize="10" fontFamily="sans-serif">CARD</text>
    </svg>
  );
}

export function CardPreview({
  cardNumber,
  cardHolder,
  expiryMonth,
  expiryYear,
  cvv,
  isFlipped,
}: CardPreviewProps) {
  const brand = detectCardBrand(cardNumber);
  const digits = cardNumber.replace(/\D/g, "");

  let displayNumber = "•••• •••• •••• ••••";
  if (digits.length > 0) {
    const first4 = digits.slice(0, 4);
    const remaining = digits.slice(4);
    const maskedRemaining = remaining.replace(/./g, "•");
    const full = first4 + maskedRemaining;
    displayNumber = full.padEnd(16, "•").replace(/(.{4})/g, "$1 ").trim();
  }

  const displayHolder = cardHolder || "YOUR NAME";
  const displayExpiry =
    expiryMonth && expiryYear
      ? `${expiryMonth}/${expiryYear.slice(-2)}`
      : "MM/YY";

  return (
    <div className="perspective-[1000px] w-full max-w-[380px] mx-auto">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative w-full aspect-[1.586/1]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #6c63ff 0%, #00d2ff 50%, #6c63ff 100%)",
          }}
        >
          <motion.div
            className="absolute inset-0 opacity-0"
            whileHover={{ opacity: 0.15 }}
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.1) 50%, transparent 54%)",
            }}
          />

          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-7 rounded bg-yellow-300/80 border border-yellow-400/50" />
            <CardBrandIcon brand={brand} />
          </div>

          <div className="relative z-10">
            <p className="text-white text-lg sm:text-xl font-mono tracking-[0.15em] mb-4">
              {displayNumber}
            </p>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">
                  Card Holder
                </p>
                <p className="text-white text-sm font-medium uppercase tracking-wide truncate max-w-[180px]">
                  {displayHolder}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">
                  Expires
                </p>
                <p className="text-white text-sm font-mono">{displayExpiry}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, #4a45b0 0%, #0098b8 100%)",
          }}
        >
          <div className="w-full h-12 bg-black/60 mt-6" />

          <div className="px-6 mt-6">
            <div className="bg-white/20 rounded-lg px-4 py-2 flex items-center justify-end">
              <p className="text-white font-mono text-lg tracking-widest">
              {cvv ? "•".repeat(cvv.length) : "•••"}
              </p>
            </div>
            <p className="text-white/40 text-[10px] text-right mt-1 uppercase tracking-wider">
              CVV
            </p>
          </div>

          <div className="mt-auto p-6 flex justify-end">
            <CardBrandIcon brand={brand} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
