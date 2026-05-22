"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { GlassCard, GlassCardHeader, GlassCardContent } from "@/components/ui/GlassCard";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import type { CurrencyDistributionData } from "@/types/transaction";

interface CurrencyDonutProps {
  data: CurrencyDistributionData[];
  isLoading: boolean;
}

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

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { color: string; currency: string };
  }>;
}) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="glass rounded-xl px-4 py-3">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: payload[0].payload.color }}
        />
        <span className="text-sm font-medium text-[#a0a0b8]">
          {payload[0].payload.currency}
        </span>
        <span className="text-sm font-bold text-white">
          {payload[0].value}
        </span>
      </div>
    </div>
  );
}

export function CurrencyDonut({ data, isLoading }: CurrencyDonutProps) {
  if (isLoading) return <ChartSkeleton />;

  const coloredData = data.map((item, index) => ({
    ...item,
    color: item.color || CURRENCY_COLORS[index % CURRENCY_COLORS.length],
  }));

  return (
    <GlassCard hover={false}>
      <GlassCardHeader>
        <h3 className="text-base font-semibold text-white">
          Currency Distribution
        </h3>
      </GlassCardHeader>
      <GlassCardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={coloredData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              nameKey="currency"
              stroke="none"
            >
              {coloredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {coloredData.map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-medium text-[#a0a0b8]">
                {entry.currency}
              </span>
            </div>
          ))}
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}
