import { Stats } from "../types";
import type { ActivityLog } from "./historyEngine";

const STAT_KEYWORDS: Record<string, keyof Stats | string> = {
  회의: "synergy",
  미팅: "synergy",
  네트워킹: "synergy",
  운동: "vitality",
  헬스: "vitality",
  러닝: "vitality",
  공부: "adaptive",
  학습: "adaptive",
  독서: "adaptive",
  기획: "strategy",
  전략: "strategy",
  마감: "execution",
  작업: "execution",
  구현: "execution",
  디자인: "finesse",
  발표: "influence",
  미팅준비: "strategy",
  출산휴가: "synergy",
  육아: "synergy",
  아이: "synergy",
  로아: "synergy",
};

export const PARENTING_KEYWORDS = ["출산휴가", "육아", "아이", "로아"];

export function isParentingEvent(summary: string): boolean {
  return PARENTING_KEYWORDS.some(k => (summary || "").includes(k));
}

export function recommendStatForEvent(summary: string): string {
  const text = summary || "";
  for (const [keyword, stat] of Object.entries(STAT_KEYWORDS)) {
    if (text.includes(keyword)) return stat as string;
  }
  return "execution";
}

export async function getTodayCalendarEvents() {
  const token = localStorage.getItem("google_access_token");
  if (!token) return [];

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfDay.toISOString()}&timeMax=${endOfDay.toISOString()}&singleEvents=true&orderBy=startTime`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("Failed to fetch calendar events:", error);
    return [];
  }
}

/** 오늘 완료된 태스크 목록을 Google Calendar 이벤트로 저장 */
export async function saveDailySummaryToCalendar(tasks: ActivityLog[]): Promise<boolean> {
  const token = localStorage.getItem("google_access_token");
  if (!token || tasks.length === 0) return false;

  const today = new Date();
  const dateStr = today.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
  const totalMs = tasks.reduce((sum, t) => sum + (t.timeSpentMs || 0), 0);
  const totalMin = Math.floor(totalMs / 60000);

  const taskLines = tasks
    .map((t, i) => {
      const sec = Math.floor((t.timeSpentMs || 0) / 1000);
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${i + 1}. ${t.title?.replace("[퀘스트 완료] ", "") || "태스크"} — ${m > 0 ? `${m}분 ` : ""}${s}초`;
    })
    .join("\n");

  const description = `📋 ${dateStr} 완료된 퀘스트\n\n${taskLines}\n\n⏱ 총 집중 시간: ${totalMin}분\n🚀 Powered by STATURE`;

  // 오늘 날짜 이벤트 (하루 종일)
  const eventStart = new Date(today);
  eventStart.setHours(23, 0, 0, 0);
  const eventEnd = new Date(today);
  eventEnd.setHours(23, 30, 0, 0);

  try {
    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `📋 오늘의 퀘스트 완료 보고서 (${tasks.length}개)`,
          description,
          start: { dateTime: eventStart.toISOString() },
          end: { dateTime: eventEnd.toISOString() },
        }),
      }
    );
    return res.ok;
  } catch (error) {
    console.error("Failed to save to calendar:", error);
    return false;
  }
}
