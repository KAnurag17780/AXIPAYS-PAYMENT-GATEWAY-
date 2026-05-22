"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { getTransactions } from "@/lib/api";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { VolumeChart } from "@/components/dashboard/Charts/VolumeChart";
import { StatusDonut } from "@/components/dashboard/Charts/StatusDonut";
import { CurrencyDonut } from "@/components/dashboard/Charts/CurrencyDonut";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import type {
  DashboardSummary,
  StatusChartData,
  VolumeOverTimeData,
  CurrencyDistributionData,
} from "@/types/transaction";

const STATUS_COLORS: Record<string, string> = {
  success: "#00e5a0",
  failed: "#ff4d6d",
  pending: "#ffb703",
};

const CURRENCY_COLORS = [
  "#6c63ff",
  "#00d2ff",
  "#00e5a0",
  "#ffb703",
  "#ff4d6d",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#8b5cf6",
  "#84cc16",
];

function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["transactions", 1, 100],
    queryFn: () => getTransactions(1, 100),
    staleTime: 60 * 1000,
  });

  const transactions = data?.data ?? [];

  const summary: DashboardSummary | null = useMemo(() => {
    if (!transactions.length) return null;

    const successTxns = transactions.filter(
      (tx) => tx.status?.toLowerCase() === "success"
    );
    const failedOrPending = transactions.filter(
      (tx) =>
        tx.status?.toLowerCase() === "failed" ||
        tx.status?.toLowerCase() === "pending"
    );

    return {
      totalTransactions: transactions.length,
      successVolume: successTxns.reduce((sum, tx) => sum + (tx.amount || 0), 0),
      successCount: successTxns.length,
      failedCount: failedOrPending.length,
    };
  }, [transactions]);

  const statusChartData: StatusChartData[] = useMemo(() => {
    if (!transactions.length) return [];

    const counts: Record<string, number> = {
      success: 0,
      failed: 0,
      pending: 0,
    };
    transactions.forEach((tx) => {
      const status = tx.status?.toLowerCase() || "pending";
      if (status in counts) {
        counts[status]++;
      }
    });

    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: STATUS_COLORS[name] || "#6b6b80",
      }));
  }, [transactions]);

  const volumeData: VolumeOverTimeData[] = useMemo(() => {
    if (!transactions.length) return [];

    const byDate: Record<string, { volume: number; count: number }> = {};

    transactions.forEach((tx) => {
      if (!tx.createdAt) return;
      const date = new Date(tx.createdAt).toISOString().split("T")[0];
      if (!byDate[date]) {
        byDate[date] = { volume: 0, count: 0 };
      }
      byDate[date].volume += tx.amount || 0;
      byDate[date].count++;
    });

    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, d]) => ({
        date: formatShortDate(date),
        volume: Math.round(d.volume * 100) / 100,
        count: d.count,
      }));
  }, [transactions]);

  const currencyData: CurrencyDistributionData[] = useMemo(() => {
    if (!transactions.length) return [];

    const byCurrency: Record<string, number> = {};
    transactions.forEach((tx) => {
      const currency = tx.currency || "Unknown";
      byCurrency[currency] = (byCurrency[currency] || 0) + 1;
    });

    return Object.entries(byCurrency)
      .sort(([, a], [, b]) => b - a)
      .map(([currency, value], index) => ({
        currency,
        value,
        color: CURRENCY_COLORS[index % CURRENCY_COLORS.length],
      }));
  }, [transactions]);

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#00d2ff]">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Dashboard
            </h1>
          </div>
          <p className="text-[#a0a0b8] text-sm">
            Monitor your payment transactions and performance metrics.
          </p>
        </motion.div>

        <div className="mb-8">
          <SummaryCards summary={summary} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-3">
            <VolumeChart data={volumeData} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            <StatusDonut
              data={statusChartData}
              isLoading={isLoading}
              totalCount={transactions.length}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-2">
            <CurrencyDonut data={currencyData} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-3" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TransactionTable transactions={transactions} isLoading={isLoading} />
        </motion.div>
      </div>
    </main>
  );
}
