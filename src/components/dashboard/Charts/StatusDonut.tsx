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
import type { StatusChartData } from "@/types/transaction";

interface StatusDonutProps {
  data: StatusChartData[];
  isLoading: boolean;
  totalCount: number;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
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
          {payload[0].name}
        </span>
        <span className="text-sm font-bold text-white">
          {payload[0].value}
        </span>
      </div>
    </div>
  );
}

export function StatusDonut({ data, isLoading, totalCount }: StatusDonutProps) {
  if (isLoading) return <ChartSkeleton />;

  return (
    <GlassCard hover={false}>
      <GlassCardHeader>
        <h3 className="text-base font-semibold text-white">
          Status Breakdown
        </h3>
      </GlassCardHeader>
      <GlassCardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#ffffff"
              fontSize="24"
              fontWeight="bold"
            >
              {totalCount}
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#6b6b80"
              fontSize="12"
            >
              Total
            </text>
          </PieChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-center gap-4 mt-2">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-medium text-[#a0a0b8]">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}
