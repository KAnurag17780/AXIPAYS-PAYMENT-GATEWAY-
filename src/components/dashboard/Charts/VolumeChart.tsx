"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GlassCard, GlassCardHeader, GlassCardContent } from "@/components/ui/GlassCard";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import type { VolumeOverTimeData } from "@/types/transaction";

interface VolumeChartProps {
  data: VolumeOverTimeData[];
  isLoading: boolean;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="glass rounded-xl px-4 py-3 space-y-1">
      <p className="text-xs text-[#a0a0b8]">{label}</p>
      <p className="text-sm font-bold text-white">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export function VolumeChart({ data, isLoading }: VolumeChartProps) {
  if (isLoading) return <ChartSkeleton />;

  return (
    <GlassCard hover={false}>
      <GlassCardHeader>
        <h3 className="text-base font-semibold text-white">
          Transaction Volume Over Time
        </h3>
      </GlassCardHeader>
      <GlassCardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6c63ff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6c63ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b6b80", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#1e1e2e" }}
            />
            <YAxis
              tick={{ fill: "#6b6b80", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#6c63ff"
              strokeWidth={2.5}
              fill="url(#volumeGrad)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#6c63ff",
                stroke: "#0a0a0f",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCardContent>
    </GlassCard>
  );
}
