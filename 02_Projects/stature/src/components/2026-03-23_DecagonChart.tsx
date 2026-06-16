import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { type Stats } from "../types";
import { STAT_LABELS } from "../types";

interface Props {
  stats: Stats;
  onStatClick?: (stat: string) => void;
}

const CustomTick = (props: any) => {
  const { x, y, payload, data, onClick } = props;
  const stat = data.find((d: any) => d.subject === payload.value);
  if (!stat) return null;

  return (
    <g
      transform={`translate(${x},${y})`}
      onClick={() => onClick?.(stat.fullKey)}
      style={{ cursor: "pointer" }}
    >
      <text x={0} y={0} dy={-6} textAnchor="middle" fill="#64748b" fontSize={11} fontWeight={700}>
        {stat.subject}
      </text>
      <text x={0} y={0} dy={12} textAnchor="middle" fill="#0f172a" fontSize={14} fontWeight={900}>
        {stat.A}
      </text>
    </g>
  );
};

export const DecagonChart: React.FC<Props> = ({ stats, onStatClick }) => {
  const data = Object.entries(stats).map(([key, value]) => ({
    subject: STAT_LABELS[key] || key,
    fullKey: key,
    A: value,
    fullMark: 100,
  }));

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
        <span className="text-xs font-bold tracking-tight">수집된 스탯이 없습니다</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[360px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={(props: any) => <CustomTick {...props} data={data} onClick={onStatClick} />}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Stature"
            dataKey="A"
            stroke="#0f172a"
            fill="#0f172a"
            fillOpacity={0.6}
            animationDuration={1500}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
