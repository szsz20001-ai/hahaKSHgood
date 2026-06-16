import React, { useState, useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import type { ActivityLog } from "../services/historyEngine";
import { STAT_LABELS } from "../types";

interface GrowthRecordPanelProps {
  activities: ActivityLog[];
}

type Period = "7days" | "30days" | "all";

export function GrowthRecordPanel({ activities }: GrowthRecordPanelProps) {
  const [period, setPeriod] = useState<Period>("7days");

  // Filter & Format Data to display growth
  const chartData = useMemo(() => {
    let daysToKeep = 7;
    if (period === "30days") daysToKeep = 30;
    if (period === "all") daysToKeep = 365;

    const now = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToKeep);

    // Filter valid activities within time
    const filtered = activities.filter(a => new Date(a.createdAt) >= startDate);
    
    // Aggregate by day (YYYY-MM-DD)
    const dailyCounts: Record<string, number> = {};
    const dailyStatDelta: Record<string, Record<string, number>> = {};

    // Pre-fill days to ensure continuous graph
    for (let i = daysToKeep - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
      dailyCounts[dateStr] = 0;
    }

    filtered.forEach(a => {
      const d = new Date(a.createdAt);
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
      if (dailyCounts[dateStr] !== undefined) {
        dailyCounts[dateStr] += 1; // Simplistic score mapping, 1 activity = 1 point roughly
      } else {
        dailyCounts[dateStr] = 1;
      }

      if (!dailyStatDelta[a.targetStat]) dailyStatDelta[a.targetStat] = {};
      dailyStatDelta[a.targetStat][dateStr] = (dailyStatDelta[a.targetStat][dateStr] || 0) + 1;
    });

    const dataArr = Object.entries(dailyCounts).map(([date, score]) => ({
      date,
      score,
    }));

    return { dataArr, dailyStatDelta, filteredCount: filtered.length };
  }, [activities, period]);

  // Derive top stat growth for widget cards
  const topStatWidget = useMemo(() => {
    const sums: Record<string, number> = {};
    chartData.filteredCount; // just dependency
    
    activities.forEach(a => {
      sums[a.targetStat] = (sums[a.targetStat] || 0) + 1;
    });
    
    let topStat = "";
    let max = 0;
    for (const [k, v] of Object.entries(sums)) {
      if (v > max) { max = v; topStat = k; }
    }
    
    if (!topStat) return { label: "없음", value: 0 };
    return { label: STAT_LABELS[topStat] || topStat, value: max };
  }, [activities, chartData]);

  return (
    <section className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base tracking-tight flex items-center gap-2">
            <TrendingUp size={18} className="text-slate-900" /> 성장 기록
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">최근 획득한 스탯의 타임라인</p>
        </div>

        {/* YouTube Studio Style Tabs */}
        <div className="flex bg-slate-50 p-1 rounded-full border border-slate-100">
          <TabButton active={period === "7days"} onClick={() => setPeriod("7days")}>7일</TabButton>
          <TabButton active={period === "30days"} onClick={() => setPeriod("30days")}>30일</TabButton>
          <TabButton active={period === "all"} onClick={() => setPeriod("all")}>전체</TabButton>
        </div>
      </div>

      <div className="flex gap-4 sm:gap-6 flex-wrap">
        {/* Apple style Widget Cards */}
        <div className="flex-1 min-w-[140px] bg-slate-50/50 p-4 border border-slate-100 rounded-[1.5rem]">
          <p className="text-xs font-bold text-slate-500 tracking-tight">최근 {period === "all" ? "전체" : period === "30days" ? "30일" : "7일"} 활동</p>
          <div className="flex items-end gap-2 mt-1">
            <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{chartData.filteredCount}</h4>
            <span className="flex items-center text-xs font-bold text-emerald-600 mb-1">
              <ArrowUpRight size={14} /> +{(chartData.filteredCount * 1.5).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-[140px] bg-slate-50/50 p-4 border border-slate-100 rounded-[1.5rem]">
          <p className="text-xs font-bold text-slate-500 tracking-tight">주목받는 성장치</p>
          <div className="flex items-end gap-2 mt-1">
            <div className="truncate min-w-0">
              <h4 className="text-xl font-black text-slate-900 tracking-tighter truncate leading-none pb-0.5">{topStatWidget.label}</h4>
              <span className="flex items-center text-xs font-bold text-emerald-600 mt-1">
                ↑ {topStatWidget.value}p 달성
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 w-full -ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.dataArr} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
              labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}
              itemStyle={{ color: '#0f172a', fontWeight: '900', fontSize: '14px' }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#0f172a" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorScore)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-1.5 text-xs font-bold rounded-full transition-colors z-10 ${
        active ? "text-slate-900 shadow-sm bg-white" : "text-slate-500 hover:text-slate-700 hover:bg-black/5"
      }`}
    >
      {children}
    </button>
  );
}
