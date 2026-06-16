import { collection, addDoc, updateDoc, doc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Stats, UserProfile } from "../types";

// In a real app, this would query a global distribution table in Firestore
// Here we simulate the relative percentile calculation
export function calculatePercentile(rawScore: number, statKey: string): number {
  if (rawScore === 0) return 0;
  
  // 기준점: 각 stat별로 난이도가 다를 수 있지만 일단 공통 로직 적용
  // In reality, this would use a cumulative distribution function (CDF)
  const base = 50;
  const variation = (rawScore / 100) * 49.9;
  const percentile = Math.min(99.9, Math.max(0.1, base + variation));
  return parseFloat(percentile.toFixed(1));
}

export function getInitialStats(): Stats {
  return {
    execution: 10,
    mastery: 10,
    vitality: 10,
    strategy: 10,
    vision: 10,
    influence: 10,
    finesse: 10,
    adaptive: 10,
    fortune: 10,
    synergy: 10,
  };
}

export async function addCheckinActivity(
  uid: string,
  placeName: string,
  visitDate: string,
  durationMinutes: number,
  currentProfile: UserProfile
) {
  // 1. Add activity to 'activities' collection
  await addDoc(collection(db, "activities"), {
    uid,
    userId: uid,
    type: "check_in",
    placeName,
    visitDate,
    durationMinutes,
    createdAt: new Date().toISOString(),
  });

  // 2. Calculate new Vitality using a simple metric: 10 minutes = +1 rawScore point
  const currentRawScore = currentProfile.rawScores.vitality || 0;
  const newRawScore = currentRawScore + durationMinutes / 10;

  const newVitalityStat = calculatePercentile(newRawScore, "vitality");

  // 3. Update users document in Firestore
  await updateDoc(doc(db, "users", uid), {
    "rawScores.vitality": newRawScore,
    "stats.vitality": newVitalityStat,
    updatedAt: new Date().toISOString(),
  });
}

export async function completeDailyQuest(
  uid: string,
  questName: string,
  targetStat: string,
  currentProfile: UserProfile,
  increment: number = 2
) {
  // deduplication check: enforce 1 unique quest name per day per user
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const activitiesRef = collection(db, "activities");
  const q = query(
    activitiesRef,
    where("userId", "==", uid),
    where("questName", "==", questName),
    where("createdAt", ">=", startOfDay.toISOString())
  );

  const snap = await getDocs(q);
  if (!snap.empty) {
    throw new Error("오늘 이미 완수하여 스탯에 반영된 퀘스트입니다.");
  }

  // 1. Add activity to 'activities' collection
  await addDoc(collection(db, "activities"), {
    uid,
    userId: uid,
    type: "daily_quest",
    questName,
    targetStat,
    createdAt: new Date().toISOString(),
  });

  // 2. Increase target stat rawScore
  const currentRawScore = currentProfile.rawScores[targetStat] || 0;
  const newRawScore = currentRawScore + increment;

  const newStatPercentile = calculatePercentile(newRawScore, targetStat);

  // 3. Update users document in Firestore
  await updateDoc(doc(db, "users", uid), {
    [`rawScores.${targetStat}`]: newRawScore,
    [`stats.${targetStat}`]: newStatPercentile,
    updatedAt: new Date().toISOString(),
  });
}

export async function syncSnsActivityLog(
  uid: string,
  platform: string,
  handle: string,
  analysis: { detected_activity: string; assigned_stat: string; score: number; reason: string },
  currentProfile: UserProfile
) {
  // 2-day deduplication
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const q = query(
    collection(db, "activities"),
    where("userId", "==", uid),
    where("platform", "==", platform),
    where("handle", "==", handle),
    where("createdAt", ">=", twoDaysAgo.toISOString())
  );
  
  const snap = await getDocs(q);
  if (!snap.empty) {
    throw new Error(`최근 48시간 이내에 이미 분석된 ${platform} 내역이 있습니다. 중복 분석 방지 로직이 작동했습니다.`);
  }

  await addDoc(collection(db, "activities"), {
    userId: uid,
    type: "sns_sync",
    platform,
    handle,
    detectedActivity: analysis.detected_activity,
    targetStat: analysis.assigned_stat,
    score: analysis.score,
    reason: analysis.reason,
    createdAt: new Date().toISOString()
  });

  const targetStat = analysis.assigned_stat;
  const currentRawScore = currentProfile.rawScores[targetStat] || 0;
  const newRawScore = currentRawScore + analysis.score;
  const newStatPercentile = calculatePercentile(newRawScore, targetStat);

  await updateDoc(doc(db, "users", uid), {
    [`rawScores.${targetStat}`]: newRawScore,
    [`stats.${targetStat}`]: newStatPercentile,
    updatedAt: new Date().toISOString(),
  });
}

