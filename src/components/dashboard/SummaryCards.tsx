"use client";

import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { CounterNumber } from "@/components/ui/CounterNumber";
import { CardSkeleton } from "@/components/ui/Skeleton";
import type { DashboardSummary } from "@/types/transaction";

interface SummaryCardsProps {
  summary: DashboardSummary | null;
  isLoading: boolean;
}

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ElementType;
  iconGradient: string;
  delay: number;
}

function StatCard({ title, value, icon: Icon, iconGradient, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        scale: 1.015,
        y: -2,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#a0a0b8]">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-white">
            {value}
          </p>
        </div>
        <div
          className="p-3 rounded-xl"
          style={{ background: iconGradient }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <StatCard
        title="Total Transactions"
        value={<CounterNumber value={summary.totalTransactions} />}
        icon={Activity}
        iconGradient="linear-gradient(135deg, #6c63ff, #8b83ff)"
        delay={0}
      />
      <StatCard
        title="Success Volume"
        value={<CounterNumber value={Math.round(summary.successVolume)} prefix="$" />}
        icon={TrendingUp}
        iconGradient="linear-gradient(135deg, #00e5a0, #00b880)"
        delay={0.1}
      />
      <StatCard
        title="Successful"
        value={<CounterNumber value={summary.successCount} />}
        icon={CheckCircle2}
        iconGradient="linear-gradient(135deg, #00e5a0, #00b880)"
        delay={0.2}
      />
      <StatCard
        title="Failed / Pending"
        value={<CounterNumber value={summary.failedCount} />}
        icon={XCircle}
        iconGradient="linear-gradient(135deg, #ff4d6d, #e63950)"
        delay={0.3}
      />
    </div>
  );
}
