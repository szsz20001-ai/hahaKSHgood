import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";
import { analyzeTaskForStat } from "./geminiService";

export type TimerState = "idle" | "running" | "paused";

export interface Task {
  id: string;
  text: string;
  createdAt: any;
  completedAt: string | null;
  timerState: TimerState;
  elapsedMs: number;
  runningFrom: number | null;
  userId: string;
}

/** 
 * tasks 컬렉션 구독 (실시간 동기화) 
 */
export function subscribeTasks(userId: string, callback: (tasks: Task[]) => void) {
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId)
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
    
    // 로컬 정렬 (문자열 날짜 또는 Timestamp 객체 모두 지원)
    tasks.sort((a, b) => {
      const getTime = (val: any) => {
        if (!val) return 0;
        if (typeof val === 'number') return val;
        if (val.seconds) return val.seconds * 1000;
        const d = new Date(val).getTime();
        return isNaN(d) ? 0 : d;
      };
      return getTime(b.createdAt) - getTime(a.createdAt);
    });
    callback(tasks);
  }, (error) => {
    console.error("Firestore Tasks Subscription Error:", error);
  });
}

/**
 * 태스크 추가
 */
export async function addTask(userId: string, text: string) {
  const taskData = {
    userId,
    text,
    createdAt: new Date().toISOString(),
    completedAt: null,
    timerState: "idle" as TimerState,
    elapsedMs: 0,
    runningFrom: null,
  };

  return addDoc(collection(db, "tasks"), taskData);
}

/**
 * 태스크 업데이트 (타이머 상태 정산 포함)
 */
export async function updateTask(userId: string, taskId: string, updates: Partial<Task>) {
  const taskRef = doc(db, "tasks", taskId);
  return updateDoc(taskRef, updates);
}

/**
 * 태스크 삭제
 */
export async function deleteTask(userId: string, taskId: string) {
  const taskRef = doc(db, "tasks", taskId);
  return deleteDoc(taskRef);
}

/**
 * 태스크 완료 (activities로 이동 후 삭제)
 */
export async function completeTaskInStore(userId: string, task: Task) {
  const endTime = new Date().toISOString();
  const extra = task.timerState === "running" && task.runningFrom ? Date.now() - task.runningFrom : 0;
  const totalMs = task.elapsedMs + extra;
  
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);

  // AI를 사용하여 task 이름에 기반한 스탯 결정 (결정사항 10:유저0)
  const targetStat = await analyzeTaskForStat(task.text);

  // 1. 활동 이력에 추가
  await addDoc(collection(db, "activities"), {
    userId,
    type: "productivity_task",
    title: `[퀘스트 완료] ${task.text}`,
    targetStat,
    description: `작업 소요 시간: ${minutes > 0 ? `${minutes}분 ` : ""}${seconds}초`,
    timeSpentMs: totalMs,
    createdAt: endTime,
  });

  // 2. 대기 목록에서 삭제
  await deleteTask(userId, task.id);
}
