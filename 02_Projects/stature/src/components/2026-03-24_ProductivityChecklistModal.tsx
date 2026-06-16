import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, Clock, Plus, Target, Flame, Play, Pause, FlagTriangleRight } from "lucide-react";
import { 
  subscribeTasks, 
  addTask, 
  updateTask, 
  deleteTask, 
  completeTaskInStore, 
  type Task 
} from "../services/taskService";

interface ProductivityChecklistModalProps {
  userUid: string;
  onClose: () => void;
}

export function ProductivityChecklistModal({ userUid, onClose }: ProductivityChecklistModalProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Subscribe to tasks from Firestore
  useEffect(() => {
    const unsub = subscribeTasks(userUid, (fetchedTasks) => {
      setTasks(fetchedTasks);
    });
    return () => unsub();
  }, [userUid]);

  // Tick for running timers
  useEffect(() => {
    const hasRunning = tasks.some(t => t.timerState === "running");
    if (hasRunning) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => setNow(Date.now()), 500);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tasks]);

  const handleAddTask = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await addTask(userUid, newTask.trim());
      setNewTask("");
    } catch (err: any) {
      console.error("Failed to add task:", err);
      alert("태스크 추가 실패: " + (err?.message || "서버 오류"));
    }
  };

  const startTimer = async (id: string) => {
    await updateTask(userUid, id, { timerState: "running", runningFrom: Date.now() });
  };

  const pauseTimer = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.timerState !== "running") return;
    const extra = task.runningFrom ? Date.now() - task.runningFrom : 0;
    await updateTask(userUid, id, { 
      timerState: "paused", 
      elapsedMs: task.elapsedMs + extra, 
      runningFrom: null 
    });
  };

  const completeTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      await completeTaskInStore(userUid, task);
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
  };

  const handleRemoveTask = async (id: string) => {
    try {
      await deleteTask(userUid, id);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const getElapsed = (task: Task): number => {
    if (task.timerState === "running" && task.runningFrom) {
      return task.elapsedMs + (now - task.runningFrom);
    }
    return task.elapsedMs;
  };

  const formatMs = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm sm:px-4"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full sm:max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[80vh]"
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white">
              <Target size={16} />
            </div>
            <div>
              <h2 className="font-black text-slate-900 tracking-tight">생산성 집중 체크리스트</h2>
              <p className="text-[10px] font-bold text-slate-400">작업 시간을 AI가 분석해 효율성을 평가합니다</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-4 bg-emerald-50 border-b border-emerald-100 shrink-0">
          <h3 className="text-xs font-black text-emerald-800 mb-1 flex items-center gap-1.5"><Flame size={14}/> 효율성 극대화 TIP</h3>
          <ul className="text-[10px] font-medium text-emerald-700 space-y-1 list-disc pl-4">
            <li><strong>우선순위(아이젠하워 연관):</strong> 중요하고 긴급한 일부터 시작하세요.</li>
            <li><strong>타임박싱(Pomodoro):</strong> 하나의 일에 집중하는 시간을 정해두고 타이머를 켜세요.</li>
            <li><strong>잘게 쪼개기:</strong> 추상적인 목표 대신 구체적인 액션 아이템 단위로 입력하세요.</li>
          </ul>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 space-y-3">
          <AnimatePresence initial={false}>
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                  <Target size={24} />
                </div>
                <p className="text-sm font-bold text-slate-400">새로운 태스크를 추가하고 집중해보세요!</p>
              </motion.div>
            ) : (
              tasks.map(task => {
                const elapsed = getElapsed(task);
                const isCompleted = !!task.completedAt;

                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCompleted
                        ? "bg-slate-50 border-slate-200 opacity-60"
                        : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-start gap-2">
                        <div className={`w-5 h-5 mt-0.5 rounded-full border-2 shrink-0 ${
                          task.timerState === "running" ? "border-indigo-500 bg-indigo-50" :
                          task.timerState === "paused" ? "border-amber-400 bg-amber-50" :
                          "border-slate-300"
                        }`} />
                        <p className={`text-sm font-bold tracking-tight break-words ${isCompleted ? "text-slate-500 line-through" : "text-slate-900"}`}>
                          {task.text}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveTask(task.id)}
                        className="text-[10px] text-slate-400 hover:text-red-500 font-bold transition-colors shrink-0"
                      >
                        삭제
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold flex items-center gap-1 ${
                        isCompleted ? "text-emerald-600" :
                        task.timerState === "running" ? "text-indigo-600 animate-pulse" :
                        task.timerState === "paused" ? "text-amber-500" :
                        "text-slate-400"
                      }`}>
                        <Clock size={12} />
                        {task.timerState === "idle" ? "타이머 대기 중" :
                         task.timerState === "running" ? `진행 중 ${formatMs(elapsed)}` :
                         `일시정지 ${formatMs(elapsed)}`}
                      </span>

                      {!isCompleted && (
                        <div className="flex items-center gap-1.5">
                          {task.timerState === "idle" && (
                            <button
                              onClick={() => startTimer(task.id)}
                              className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                            >
                              <Play size={11} /> 시작
                            </button>
                          )}
                          {task.timerState === "running" && (
                            <>
                              <button
                                onClick={() => pauseTimer(task.id)}
                                className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                              >
                                <Pause size={11} /> 일시정지
                              </button>
                              <button
                                onClick={() => completeTask(task.id)}
                                className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                              >
                                <FlagTriangleRight size={11} /> 마감
                              </button>
                            </>
                          )}
                          {task.timerState === "paused" && (
                            <>
                              <button
                                onClick={() => startTimer(task.id)}
                                className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                              >
                                <Play size={11} /> 재개
                              </button>
                              <button
                                onClick={() => completeTask(task.id)}
                                className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                              >
                                <FlagTriangleRight size={11} /> 마감
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        <div className="p-5 border-t border-slate-100 bg-white shrink-0 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (!e.nativeEvent.isComposing) {
                    handleAddTask(e as unknown as React.FormEvent);
                  }
                }
              }}
              placeholder="구체적인 액션 아이템을 적고 시작하세요..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-2xl h-14 pl-4 pr-14 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={handleAddTask}
              disabled={!newTask.trim()}
              className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-slate-900 text-white rounded-xl disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all"
          >
            저장 및 닫기
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
