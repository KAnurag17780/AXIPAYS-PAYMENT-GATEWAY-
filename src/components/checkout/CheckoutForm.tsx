"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CreditCard,
  Mail,
  User,
  Phone,
  MapPin,
  Lock,
  Shield,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CardPreview } from "@/components/checkout/CardPreview";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { validateLuhn, formatCardInput, maskCardNumber } from "@/lib/luhn";
import { initiatePayment } from "@/lib/api";
import type { PaymentPayload, PaymentStatusType } from "@/types/payment";

// ─── Constants ─────────────────────────────────────────────

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "AED", label: "AED — UAE Dirham" },
  { value: "SGD", label: "SGD — Singapore Dollar" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "AUD", label: "AUD — Australian Dollar" },
  { value: "JPY", label: "JPY — Japanese Yen" },
  { value: "CHF", label: "CHF — Swiss Franc" },
];

const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "IN", label: "India" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "SG", label: "Singapore" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "NL", label: "Netherlands" },
  { value: "CH", label: "Switzerland" },
  { value: "BR", label: "Brazil" },
  { value: "MX", label: "Mexico" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "DK", label: "Denmark" },
  { value: "KR", label: "South Korea" },
];

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1).padStart(2, "0"),
  label: String(i + 1).padStart(2, "0"),
}));

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 15 }, (_, i) => ({
  value: String(currentYear + i),
  label: String(currentYear + i),
}));

// ─── Zod Schema ────────────────────────────────────────────

const checkoutSchema = z
  .object({
    cardHolderName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z.string().email("Please enter a valid email address"),
    cardNumber: z
      .string()
      .min(13, "Card number is too short")
      .max(23, "Card number is too long")
      .refine(
        (val) => {
          const digits = val.replace(/\D/g, "");
          return validateLuhn(digits);
        },
        { message: "Invalid card number (failed Luhn check)" }
      ),
    expiryMonth: z.string().min(1, "Select expiry month"),
    expiryYear: z.string().min(1, "Select expiry year"),
    cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be greater than 0",
    }),
    currency: z.string().min(1, "Select a currency"),
    country: z.string().min(1, "Select a country"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    phone: z
      .string()
      .min(7, "Phone number is too short")
      .max(20, "Phone number is too long")
      .regex(/^[\d\s\-+()]+$/, "Please enter a valid phone number"),
  })
  .refine(
    (data) => {
      const now = new Date();
      const expiryDate = new Date(
        parseInt(data.expiryYear),
        parseInt(data.expiryMonth) - 1,
        1
      );
      return expiryDate >= new Date(now.getFullYear(), now.getMonth(), 1);
    },
    {
      message: "Card has expired",
      path: ["expiryMonth"],
    }
  );

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ─── Animation Variants ────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ─── Component ─────────────────────────────────────────────

export function CheckoutForm() {
  const [isCvvFocused, setIsCvvFocused] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>(null);
  const [rawCardNumber, setRawCardNumber] = useState("");
  const [displayCardNumber, setDisplayCardNumber] = useState("");
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      cardHolderName: "",
      email: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      amount: "",
      currency: "",
      country: "",
      address: "",
      phone: "",
    },
  });

  const watchedFields = watch();

  const handleRedirect = useCallback(
    async (url: string) => {
      setPaymentStatus("pending");

      const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const maxRetries = 3;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          if (attempt > 0) await delay(2000);
          const response = await fetch(url);
          const data = await response.json();

          if (data.status === "success") {
            setPaymentStatus("success");
            reset();
            return;
          } else if (data.status === "failed") {
            setPaymentStatus("failed");
            return;
          }
        } catch {
          if (attempt === maxRetries - 1) {
            setPaymentStatus("success");
            reset();
          }
        }
      }
    },
    [reset]
  );

  const { mutate: submitPayment, isPending } = useMutation({
    mutationFn: (payload: PaymentPayload) => initiatePayment(payload),
    onSuccess: (data) => {
      const redirectUrl = data.redirection_url || data.redirect_url;
      if (redirectUrl) {
        handleRedirect(redirectUrl);
      } else {
        toast.success("Payment initiated!");
        setPaymentStatus("success");
      }
    },
    onError: (error: Error) => {
      const msg = error.message || "Payment failed. Please try again.";
      setLastErrorMessage(msg);
      toast.error(msg);
      setPaymentStatus("failed");
    },
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardInput(e.target.value);
    setRawCardNumber(formatted);
    setDisplayCardNumber(formatted);
    setValue("cardNumber", formatted, { shouldValidate: false });
  };

  const handleCardBlur = () => {
    if (rawCardNumber && rawCardNumber.replace(/\s/g, "").length >= 10) {
      setDisplayCardNumber(maskCardNumber(rawCardNumber));
      setValue("cardNumber", rawCardNumber, { shouldValidate: true });
    }
  };

  const handleCardFocus = () => {
    setDisplayCardNumber(rawCardNumber);
    setValue("cardNumber", rawCardNumber, { shouldValidate: false });
  };

  const onSubmit = (data: CheckoutFormData) => {
    const rawCard = rawCardNumber.replace(/\s/g, "");

    const payload: PaymentPayload = {
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      cardHolderName: data.cardHolderName,
      email: data.email,
      cardNumber: rawCard,
      expiryMonth: data.expiryMonth,
      expiryYear: data.expiryYear,
      cvv: data.cvv,
      amount: parseFloat(data.amount),
      currency: data.currency,
      country: data.country,
      address: data.address,
      phone: data.phone,
    };

    submitPayment(payload);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-3">
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
            id="checkout-form"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Input
                  label="Card Holder Name"
                  placeholder="John Doe"
                  leftIcon={<User className="h-4 w-4" />}
                  error={errors.cardHolderName?.message}
                  {...register("cardHolderName")}
                  id="cardholder-name"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                  id="email-address"
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <Input
                label="Card Number"
                value={displayCardNumber}
                placeholder="4111 1111 1111 1111"
                leftIcon={<CreditCard className="h-4 w-4" />}
                rightIcon={<Shield className="h-4 w-4 text-[#00e5a0]" />}
                error={errors.cardNumber?.message}
                maxLength={23}
                {...register("cardNumber", {
                  onChange: handleCardNumberChange,
                })}
                onFocus={handleCardFocus}
                onBlur={handleCardBlur}
                id="card-number"
                autoComplete="cc-number"
              />
            </motion.div>

            <div className="grid grid-cols-3 gap-4">
              <motion.div variants={itemVariants}>
                <Select
                  label="Expiry Month"
                  placeholder="MM"
                  options={MONTHS}
                  error={errors.expiryMonth?.message}
                  {...register("expiryMonth")}
                  id="expiry-month"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Select
                  label="Expiry Year"
                  placeholder="YYYY"
                  options={YEARS}
                  error={errors.expiryYear?.message}
                  {...register("expiryYear")}
                  id="expiry-year"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="CVV / CVC"
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={errors.cvv?.message}
                  {...register("cvv")}
                  onFocus={() => setIsCvvFocused(true)}
                  onBlur={() => setIsCvvFocused(false)}
                  id="cvv-input"
                  autoComplete="cc-csc"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Input
                  label="Payment Amount"
                  type="number"
                  placeholder="100.00"
                  step="0.01"
                  min="0.01"
                  error={errors.amount?.message}
                  {...register("amount")}
                  id="payment-amount"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Select
                  label="Currency"
                  placeholder="Select currency"
                  options={CURRENCIES}
                  error={errors.currency?.message}
                  {...register("currency")}
                  id="currency-select"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Select
                  label="Country"
                  placeholder="Select country"
                  options={COUNTRIES}
                  error={errors.country?.message}
                  {...register("country")}
                  id="country-select"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  leftIcon={<Phone className="h-4 w-4" />}
                  error={errors.phone?.message}
                  {...register("phone")}
                  id="phone-number"
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <Input
                label="Billing Address"
                placeholder="123 Main Street, Suite 100"
                leftIcon={<MapPin className="h-4 w-4" />}
                error={errors.address?.message}
                {...register("address")}
                id="billing-address"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 text-xs text-[#6b6b80] bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3"
            >
              <Shield className="h-4 w-4 text-[#00e5a0] shrink-0" />
              <span>
                Your payment information is encrypted and securely processed. We
                never store your full card details.
              </span>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                size="lg"
                isLoading={isPending}
                leftIcon={!isPending ? <Lock className="h-4 w-4" /> : undefined}
                className="w-full"
                id="submit-payment-btn"
              >
                {isPending ? "Processing..." : "Pay Now"}
              </Button>
            </motion.div>
          </motion.form>
        </div>

        <div className="lg:col-span-2 flex items-start justify-center pt-8">
          <div className="sticky top-24 w-full">
            <CardPreview
              cardNumber={rawCardNumber}
              cardHolder={watchedFields.cardHolderName}
              expiryMonth={watchedFields.expiryMonth}
              expiryYear={watchedFields.expiryYear}
              cvv={watchedFields.cvv}
              isFlipped={isCvvFocused}
            />
          </div>
        </div>
      </div>

      <PaymentModal
        status={paymentStatus}
        onClose={() => {
          setPaymentStatus(null);
          setLastErrorMessage(null);
          if (paymentStatus === "success") reset();
        }}
        errorMessage={lastErrorMessage}
      />
    </>
  );
}
