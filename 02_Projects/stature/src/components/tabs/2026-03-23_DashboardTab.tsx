import React, { useState, useEffect, useMemo } from "react";
import type { User } from "firebase/auth";
import {
  Trophy,
  Zap,
  Activity,
  Target,
  Eye,
  Share2,
  Palette,
  TrendingUp,
  Dices,
  Users,
  ChevronRight,
  Plus,
  Settings,
  MapPin,
  Watch,
  Link as LinkIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Stats, UserProfile } from "../../types";
import { STAT_LABELS, STAT_DESCRIPTIONS, STAT_RECOMMENDATIONS } from "../../types";
import { DecagonChart } from "../DecagonChart";
import { PlaceCheckinModal } from "../PlaceCheckinModal";
import { DailyQuestPanel } from "../DailyQuestPanel";
import { SnsSyncModal } from "../SnsSyncModal";
import { GrowthRecordPanel } from "../GrowthRecordPanel";
import { fetchUserActivities, type ActivityLog } from "../../services/historyEngine";

export const STAT_ICONS: Record<keyof Stats, React.ComponentType<{ size?: number; className?: string }>> = {
  execution: Zap,
  mastery: Trophy,
  vitality: Activity,
  strategy: Target,
  vision: Eye,
  influence: Share2,
  finesse: Palette,
  adaptive: TrendingUp,
  fortune: Dices,
  synergy: Users,
};

interface DashboardTabProps {
  user: User;
  profile: UserProfile;
  selectedStat: keyof Stats | null;
  onSelectStat: (stat: keyof Stats | null) => void;
  onNavigateToSettings: () => void;
}

export function DashboardTab({
  user,
  profile,
  selectedStat,
  onSelectStat,
  onNavigateToSettings
}: DashboardTabProps) {
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isSnsModalOpen, setIsSnsModalOpen] = useState(false);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    fetchUserActivities(user.uid).then((logs) => {
      setActivities(logs);
    });
  }, [user.uid]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <>
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 pt-6 space-y-5"
      >
        <section className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 sm:gap-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-full blur opacity-25" />
            <img
              src={user.photoURL || ""}
              className="relative w-20 h-20 rounded-full border-4 border-white"
              alt="Avatar"
            />
            <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              LV.{" "}
              {Math.floor(
                (Object.values(profile.stats) as number[]).reduce((a, b) => a + b, 0) / 10
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold">{profile.displayName}</h2>
            <p className="text-slate-500 text-sm">{profile.job || "분야를 설정해주세요"}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">
                Top 0.1%
              </span>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
                Mastery Focus
              </span>
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-4 lg:items-stretch lg:gap-5">
          <section className="flex-[3] min-w-0 bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-100 space-y-2 flex flex-col justify-center">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">상태 다이어그램</h3>
              <span className="text-[10px] font-bold text-slate-400 font-mono shrink-0 bg-slate-50 px-2 py-1 rounded-full">
                Relative Percentile
              </span>
            </div>
            <DecagonChart stats={profile.stats} onStatClick={(stat) => onSelectStat(stat)} />
          </section>

          <section className="flex-[2] shrink-0 space-y-4 flex flex-col min-w-[320px]">
            <DailyQuestPanel userUid={user.uid} currentProfile={profile} />

            <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col flex-1">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight mb-1">
                증명 및 외부 인증
              </h3>
              <p className="text-[10px] text-slate-500 mb-3 leading-snug font-medium">
                외부 활동 기록을 메타데이터로 변환해 스탯을 증명하세요.
              </p>
              <div className="flex flex-col gap-2 flex-1">
                <AuthQuestButton
                  icon={MapPin}
                  label="구글 맵 장소 체크인"
                  onClick={() => setIsCheckinModalOpen(true)}
                />
                <AuthQuestButton
                  icon={LinkIcon}
                  label="성장의 흔적 연결 (SNS)"
                  onClick={() => setIsSnsModalOpen(true)}
                />
                <AuthQuestButton
                  icon={Watch}
                  label="스마트워치 동기화"
                  onClick={() => {}}
                />
              </div>
            </div>
          </section>
        </div>

        <GrowthRecordPanel activities={activities} />

        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        >
          {Object.entries(profile.stats).map(([key, value]) => {
            const Icon = STAT_ICONS[key as keyof typeof STAT_ICONS] || Zap;
            return (
              <motion.button
                variants={itemVariants}
                key={key}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectStat(key as keyof Stats)}
                className={`relative p-5 rounded-3xl border text-left transition-all overflow-hidden group ${
                  selectedStat === key
                    ? "bg-slate-900 border-slate-900 text-white shadow-xl"
                    : "bg-white border-slate-100 text-slate-900 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div className={`p-3 rounded-2xl ${selectedStat === key ? "bg-white/10" : "bg-slate-50 group-hover:bg-slate-100"} transition-colors`}>
                    <Icon size={24} className={selectedStat === key ? "text-white" : "text-slate-600"} />
                  </div>
                  <span className="text-xl font-black">{Math.round(value)}%</span>
                </div>
                <h4 className="font-bold text-base mb-1 relative z-10">{STAT_LABELS[key] || key}</h4>
                <p className={`text-[11px] leading-relaxed relative z-10 ${selectedStat === key ? "text-slate-300" : "text-slate-500"}`}>
                  추천: {STAT_RECOMMENDATIONS[key] || "자율적으로 획득된 스탯입니다."}
                </p>
                
                <Icon size={100} className={`absolute -bottom-6 -right-6 opacity-5 pointer-events-none transform -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-0`} />
              </motion.button>
            );
          })}
        </motion.section>
      </motion.main>

      <AnimatePresence>
        {selectedStat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onSelectStat(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-50 p-8 max-w-2xl mx-auto shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />

              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-slate-900 text-white rounded-2xl">
                  {React.createElement(STAT_ICONS[selectedStat as keyof typeof STAT_ICONS] || Zap, { size: 32 })}
                </div>
                <div>
                  <h4 className="text-2xl font-black tracking-tight">{STAT_LABELS[selectedStat] || selectedStat}</h4>
                  <p className="text-slate-500 text-sm">{STAT_DESCRIPTIONS[selectedStat] || "자율 측정 측정된 무한 스탯입니다."}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-600">현재 지수</span>
                    <span className="text-3xl font-black text-slate-900">
                      {profile.stats[selectedStat]}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profile.stats[selectedStat]}%` }}
                      className="h-full bg-slate-900"
                    />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    전체 사용자 중 상위 {(100 - profile.stats[selectedStat]).toFixed(1)}%에 위치하고
                    있습니다. 최근 7일간 지수가 0.4% 상승했습니다.
                  </p>
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <ChevronRight size={18} /> 추천 퀘스트
                  </h5>
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div
                         key={i}
                         className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-slate-300 transition-all cursor-pointer"
                      >
                         <div>
                          <p className="font-bold text-sm">일일 과업 100% 달성하기</p>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase">
                            Expected Delta: ▲ 0.2%
                          </p>
                        </div>
                        <Plus size={20} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCheckinModalOpen && (
          <PlaceCheckinModal
            userUid={user.uid}
            currentProfile={profile}
            onClose={() => setIsCheckinModalOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSnsModalOpen && (
          <SnsSyncModal
            userUid={user.uid}
            currentProfile={profile}
            onClose={() => setIsSnsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function AuthQuestButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all px-3 py-2.5 flex items-center gap-2.5"
    >
      <span className="font-mono text-slate-400 text-sm leading-none select-none" aria-hidden>
        [
      </span>
      <Icon size={18} className="text-slate-600 shrink-0" aria-hidden />
      <span className="font-bold text-xs sm:text-sm text-slate-800 leading-tight flex-1">{label}</span>
      <span className="font-mono text-slate-400 text-sm leading-none select-none" aria-hidden>
        ]
      </span>
    </button>
  );
}
