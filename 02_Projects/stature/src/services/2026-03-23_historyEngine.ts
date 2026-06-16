import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export interface ActivityLog {
  uid: string;
  type: string;
  title: string;
  questName: string;
  targetStat: string;
  description: string;
  timeSpentMs: number;
  createdAt: string;
}

export async function fetchUserActivities(uid: string): Promise<ActivityLog[]> {
  const q = query(
    collection(db, "activities"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc")
  );
  
  try {
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as ActivityLog);
  } catch (error) {
    console.error("Failed to fetch historical activities:", error);
    return [];
  }
}

export async function fetchTodayCompletedTasks(uid: string): Promise<ActivityLog[]> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const q = query(
    collection(db, "activities"),
    where("userId", "==", uid),
    where("type", "==", "productivity_task"),
    where("createdAt", ">=", todayStart.toISOString()),
    orderBy("createdAt", "desc")
  );

  try {
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as ActivityLog);
  } catch (error) {
    console.error("Failed to fetch today's tasks:", error);
    return [];
  }
}
