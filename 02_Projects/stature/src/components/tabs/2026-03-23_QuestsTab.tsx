import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target, CheckCircle2, Clock, FlagTriangleRight, CalendarCheck, Loader2,
  ChevronDown, ChevronUp, History
} from "lucide-react";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { fetchUserActivities, fetchTodayCompletedTasks, type ActivityLog } from "../../services/historyEngine";
import { saveDailySummaryToCalendar } from "../../services/calendarService";

interface QuestsTabProps {
  userUid: string;
}

function formatMs(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function QuestsTab({ userUid }: QuestsTabProps) {
  const [historyTab, setHistoryTab] = useState<"today" | "all">("today");
  const [todayTasks, setTodayTasks] = useState<ActivityLog[]>([]);
  const [allTasks, setAllTasks] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<"idle" | "success" | "error">("idle");
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const [today, all] = await Promise.all([
      fetchTodayCompletedTasks(userUid),
      fetchUserActivities(userUid).then(logs => logs.filter(l => l.type === "productivity_task")),
    ]);
    setTodayTasks(today);
    setAllTasks(all);
    setLoading(false);
  }, [userUid]);

  useEffect(() => { load(); }, [load]);

  const handleDailyClose = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveResult("idle");

    try {
      const todayStr = new Date().toISOString().split("T")[0];

      // 1. Firestore daily summary 저장
      const totalMs = todayTasks.reduce((s, t) => s + (t.timeSpentMs || 0), 0);
      await setDoc(
        doc(db, "dailySummaries", userUid, "days", todayStr),
        {
          userId: userUid,
          date: todayStr,
          taskCount: todayTasks.length,
          totalFocusMs: totalMs,
          tasks: todayTasks.map(t => ({
            title: t.title || "",
            timeSpentMs: t.timeSpentMs || 0,
            createdAt: t.createdAt,
          })),
          savedAt: new Date().toISOString(),
        }
      );

      // 2. activities 컬렉션에도 이력 추가
      await addDoc(collection(db, "activities"), {
        userId: userUid,
        type: "daily_summary",
        title: `[하루 마감] ${todayStr} — ${todayTasks.length}개 퀘스트 완료`,
        targetStat: "execution",
        description: `총 집중 시간: ${formatMs(totalMs)}`,
        timeSpentMs: totalMs,
        createdAt: new Date().toISOString(),
      });

      // 3. 구글 캘린더 이벤트 등록 (토큰 있을 때만)
      await saveDailySummaryToCalendar(todayTasks);

      setSaveResult("success");
      load();
    } catch (err) {
      console.error("Daily close failed:", err);
      setSaveResult("error");
    } finally {
      setIsSaving(false);
    }
  };

  const displayTasks = historyTab === "today" ? todayTasks : allTasks;

  const todayTotalMs = todayTasks.reduce((s, t) => s + (t.timeSpentMs || 0), 0);

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto px-4 pt-6 pb-10 space-y-5"
    >
      {/* Header summary */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
            <Target size={20} />
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-lg tracking-tight">퀘스트 & 이력</h2>
            <p className="text-[11px] text-slate-400 font-medium">완료된 태스크와 집중 시간을 기록합니다</p>
          </div>
        </div>

        {/* Today stat bar */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-indigo-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-indigo-700">{todayTasks.length}</p>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-0.5">오늘 완료</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-emerald-700">{Math.floor(todayTotalMs / 60000)}분</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-0.5">오늘 집중</p>
          </div>
        </div>
      </div>

      {/* Daily close button */}
      <div className="space-y-2">
        <button
          onClick={handleDailyClose}
          disabled={isSaving || todayTasks.length === 0}
          className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]"
        >
          {isSaving ? (
            <><Loader2 size={18} className="animate-spin" /> 저장 중...</>
          ) : (
            <><FlagTriangleRight size={18} /> 오늘 하루 마감하기</>
          )}
        </button>

        <AnimatePresence>
          {saveResult === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm font-bold"
            >
              <CalendarCheck size={16} />
              저장 완료! 캘린더에도 기록됐어요 🎉
            </motion.div>
          )}
          {saveResult === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-bold"
            >
              저장 실패. 다시 시도해주세요.
            </motion.div>
          )}
        </AnimatePresence>

        {todayTasks.length === 0 && !loading && (
          <p className="text-center text-[11px] text-slate-400 font-medium">
            오늘 완료된 퀘스트가 없습니다. + 버튼으로 시작하세요!
          </p>
        )}
      </div>

      {/* History tabs */}
      <div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl mb-4">
          {(["today", "all"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setHistoryTab(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                historyTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "today" ? <><CheckCircle2 size={13} /> 오늘</> : <><History size={13} /> 전체 이력</>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={24} className="animate-spin text-slate-400" />
          </div>
        ) : displayTasks.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target size={22} className="text-slate-300" />
            </div>
            <p className="text-sm font-bold">아직 완료된 태스크가 없어요</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {displayTasks.map((task, i) => {
                const isOpen = showDetails[task.createdAt + i];
                const title = (task.title || "").replace("[퀘스트 완료] ", "");
                return (
                  <motion.div
                    key={task.createdAt + i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <button
                      className="w-full p-4 flex items-start gap-3 text-left"
                      onClick={() => setShowDetails(prev => ({ ...prev, [task.createdAt + i]: !isOpen }))}
                    >
                      <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{title || "태스크"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono font-semibold text-indigo-600 flex items-center gap-1">
                            <Clock size={10} /> {formatMs(task.timeSpentMs || 0)}
                          </span>
                          <span className="text-[10px] text-slate-400">· {formatDate(task.createdAt)}</span>
                        </div>
                      </div>
                      {isOpen ? <ChevronUp size={16} className="text-slate-400 shrink-0 mt-0.5" /> : <ChevronDown size={16} className="text-slate-400 shrink-0 mt-0.5" />}
                    </button>
                    {isOpen && task.description && (
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-slate-50 pt-3">
                          <p className="text-xs text-slate-500 font-medium">{task.description}</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.main>
  );
}
