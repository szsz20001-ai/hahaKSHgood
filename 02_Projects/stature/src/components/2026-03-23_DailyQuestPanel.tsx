import React, { useState, useEffect } from "react";
import { loginWithGoogle } from "../firebase";
import { Stats, STAT_LABELS } from "../types";
import { completeDailyQuest } from "../services/statEngine";
import type { UserProfile } from "../types";
import { getTodayCalendarEvents, recommendStatForEvent, isParentingEvent } from "../services/calendarService";
import { subscribeTasks, completeTaskInStore, type Task } from "../services/taskService";
import { Calendar, CheckCircle2, Clock, Zap } from "lucide-react";

interface DailyQuestPanelProps {
  userUid: string;
  currentProfile: UserProfile;
}

export function DailyQuestPanel({ userUid, currentProfile }: DailyQuestPanelProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [manualTasks, setManualTasks] = useState<Task[]>([]);
  const [loadingCal, setLoadingCal] = useState(false);
  const [completedQuests, setCompletedQuests] = useState<Set<string>>(new Set());
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("google_access_token");
    if (token) {
      setHasToken(true);
      loadEvents();
    }

    // Subscribe to manual productivity tasks
    const unsubTasks = subscribeTasks(userUid, (tasks) => {
      setManualTasks(tasks);
    });

    return () => unsubTasks();
  }, [userUid]);

  const loadEvents = async () => {
    setLoadingCal(true);
    const fetchedEvents = await getTodayCalendarEvents();
    setEvents(fetchedEvents);
    setLoadingCal(false);
  };

  const handleConnectCalendar = async () => {
    try {
      setLoadingCal(true);
      await loginWithGoogle();
      setHasToken(true);
      await loadEvents();
    } catch (e) {
      console.error(e);
      setLoadingCal(false);
    }
  };

  const handleCompleteEvent = async (ev: any) => {
    if (completedQuests.has(ev.id)) return;
    
    const targetStat = recommendStatForEvent(ev.summary);
    const questName = `[캘린더] ${ev.summary}`;
    
    try {
      await completeDailyQuest(userUid, questName, targetStat, currentProfile, 1);
      setCompletedQuests(prev => new Set(prev).add(ev.id));
      if (isParentingEvent(ev.summary)) {
        alert(`[${ev.summary}] 완료!\n육아 휴직 중에도 빛나는 당신의 헌신적인 노력이 [가족 시너지(Synergy)] 스탯에 따뜻하게 기록되었습니다.`);
      } else {
        alert(`[${ev.summary}] 퀘스트 완료!\n${STAT_LABELS[targetStat] || targetStat} 스탯이 1점 올랐습니다.`);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "퀘스트 완료 중 오류가 발생했습니다.");
    }
  };

  const handleCompleteManualTask = async (task: Task) => {
    try {
      await completeTaskInStore(userUid, task);
      alert(`[${task.text}] 퀘스트 완료!\n실행력(Execution) 스탯이 상승했습니다.`);
    } catch (err) {
      console.error(err);
      alert("태스크 완료 처리 중 오류가 발생했습니다.");
    }
  };

  const formatMs = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}분 ${s}초`;
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-50">
        <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
          <CheckCircle2 size={18} className="text-slate-500" /> 오늘의 목표 및 퀘스트
        </h3>
        {!hasToken && (
          <button
            onClick={handleConnectCalendar}
            disabled={loadingCal}
            className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors"
          >
            {loadingCal ? "연동 중..." : "구글 캘린더 연동"}
          </button>
        )}
      </div>
      <p className="text-[10px] text-slate-500 mb-3 leading-snug font-medium">
        일정과 할 일을 완료하고 성장을 증명하세요.
      </p>

      <div className="flex flex-col gap-2 flex-1 max-h-72 overflow-y-auto pr-1">
        {/* Manual Tasks Section */}
        {manualTasks.length > 0 && (
          <div className="space-y-2 mb-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">체크리스트 할 일</h4>
            {manualTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col p-3 rounded-2xl border bg-white border-slate-200 shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-sm tracking-tight pr-2 leading-tight text-slate-800">
                    {task.text}
                  </p>
                  <button
                    onClick={() => handleCompleteManualTask(task)}
                    className="shrink-0 text-xs font-black px-3 py-1.5 rounded-xl bg-indigo-600 border-2 border-indigo-600 text-white shadow-sm hover:bg-white hover:text-indigo-600 active:scale-95 transition-all"
                  >
                    [ 완료 ]
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    task.timerState === "running" ? "bg-indigo-50 text-indigo-600 animate-pulse" : "bg-slate-50 text-slate-400"
                  }`}>
                    <Clock size={10} /> {task.timerState === "idle" ? "대기 중" : formatMs(task.elapsedMs)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Zap size={10} /> 실행력 반영
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calendar Events Section */}
        {hasToken && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">캘린더 일정</h4>
            {events.length === 0 ? (
              <p className="text-[11px] text-slate-400 font-medium px-1">오늘 진행 가능한 일정이 없습니다.</p>
            ) : (
              events.map((ev) => {
                const expectedStat = recommendStatForEvent(ev.summary);
                const isCompleted = completedQuests.has(ev.id);
                
                let timeText = "";
                if (ev.start?.dateTime) {
                  timeText = new Date(ev.start.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                }

                return (
                  <div
                    key={ev.id}
                    className={`flex flex-col p-3 rounded-2xl border transition-all ${
                      isCompleted ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className={`font-bold text-sm tracking-tight pr-2 leading-tight ${isCompleted ? "line-through text-slate-400" : "text-slate-800"}`}>
                        [ {ev.summary} ]
                      </p>
                      <button
                        onClick={() => handleCompleteEvent(ev)}
                        disabled={isCompleted}
                        className={`shrink-0 text-xs font-black px-3 py-1.5 rounded-xl transition-all ${
                          isCompleted ? "bg-slate-200 text-slate-500" : "bg-slate-900 border-2 border-slate-900 text-white shadow-sm hover:bg-white hover:text-slate-900 active:scale-95"
                        }`}
                      >
                        {isCompleted ? "완료됨" : "[ 완료 ]"}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-md">
                        {timeText || "종일"}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {STAT_LABELS[expectedStat]} 반영: +1점
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {!hasToken && manualTasks.length === 0 && (
          <div className="text-center py-6">
            <p className="text-xs text-slate-400 font-medium">오늘 진행 가능한 일정이나 할 일이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
