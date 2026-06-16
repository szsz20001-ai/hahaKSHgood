import React, { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { Activity, Target, Plus, Users, Settings, LogOut } from "lucide-react";
import type { Stats, UserProfile } from "../types";

import { DashboardTab } from "./tabs/DashboardTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { QuestsTab } from "./tabs/QuestsTab";
import { NetworkTab } from "./tabs/NetworkTab";
import { fetchUserActivities } from "../services/historyEngine";
import { generateDailyCoachMessage } from "../services/geminiService";
import { STAT_LABELS } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { collection, query, where, getDocs, limit, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ProductivityChecklistModal } from "./ProductivityChecklistModal";

type ActiveTab = "dashboard" | "quests" | "settings" | "network";

interface MainDashboardProps {
  user: User;
  profile: UserProfile;
  selectedStat: keyof Stats | null;
  onSelectStat: (stat: keyof Stats | null) => void;
  onLogout: () => void;
}

export function MainDashboard({
  user,
  profile,
  selectedStat,
  onSelectStat,
  onLogout,
}: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [coachMessage, setCoachMessage] = useState<string | null>(null);
  const [showProductivityModal, setShowProductivityModal] = useState(false);

  useEffect(() => {
    const initializeReport = async () => {
      const todayStr = new Date().toISOString().split("T")[0];
      const cacheKey = `stature_coach_${user.uid}_${todayStr}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        setCoachMessage(cached);
        return;
      }

      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const q = query(
          collection(db, "activities"),
          where("userId", "==", user.uid),
          where("targetStat", "==", "AI Report"),
          where("createdAt", ">=", todayStart.toISOString()),
          limit(1)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const reportDoc = snapshot.docs[0].data();
          setCoachMessage(reportDoc.description);
          localStorage.setItem(cacheKey, reportDoc.description);
        } else {
          // 비동기 대기열에 등록 (자동 생성)
          setTimeout(() => {
            handleGenerateReport();
          }, 3000);
        }
      } catch (e) {
        console.error("Failed to check daily report:", e);
      }
    };
    
    initializeReport();
  }, [user.uid]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    const todayStr = new Date().toISOString().split("T")[0];
    const cacheKey = `stature_coach_${user.uid}_${todayStr}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setCoachMessage(cached);
      setIsGenerating(false);
      return;
    }

    try {
      const logs = await fetchUserActivities(user.uid);
      const last7Days = logs.filter(l => new Date(l.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
      const summary = last7Days.map(l => STAT_LABELS[l.targetStat as keyof unknown] || l.targetStat).join(", ");
      
      const msg = await generateDailyCoachMessage(summary);
      setCoachMessage(msg);
      localStorage.setItem(cacheKey, msg);
      
      // Save report to activities to prevent redundant calls on refresh/login across devices
      await addDoc(collection(db, "activities"), {
        userId: user.uid,
        title: "Daily AI Report",
        targetStat: "AI Report",
        description: msg,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error(e);
      setCoachMessage("매일 조금씩 발전하는 모습이 훌륭해요! 오늘도 파이팅!");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab 
            user={user} 
            profile={profile} 
            selectedStat={selectedStat} 
            onSelectStat={onSelectStat}
            onNavigateToSettings={() => setActiveTab("settings")}
          />
        );
      case "quests":
        return <QuestsTab userUid={user.uid} />;
      case "network":
        return <NetworkTab userUid={user.uid} currentProfile={profile} />;
      case "settings":
        return <SettingsTab user={user} profile={profile} onLogout={onLogout} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 flex flex-col">
      <header className="sticky top-0 z-30 glass px-6 py-4 flex items-center justify-between">
        <h1 
          className="text-2xl font-black tracking-tighter cursor-pointer hover:text-slate-700 transition-colors"
          onClick={() => setActiveTab("dashboard")}
        >
          STATURE
        </h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGenerateReport}
            className="hidden sm:flex bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors items-center gap-2"
          >
            <Activity size={16} /> 리포트 생성
          </button>
          <button 
            onClick={handleGenerateReport}
            className="sm:hidden bg-slate-900 text-white p-2 rounded-full text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors flex items-center justify-center"
          >
            <Activity size={16} />
          </button>
          <img
            src={user.photoURL || ""}
            className="w-10 h-10 rounded-full border-2 border-slate-900 cursor-pointer"
            onClick={() => setActiveTab("settings")}
            alt="Profile"
          />
        </div>
      </header>

      <div className="flex-1 w-full relative z-10">
        {renderActiveTab()}
      </div>

      <nav className="fixed bottom-6 left-6 right-6 h-16 glass rounded-2xl z-40 flex items-center justify-around px-4">
        <button 
          onClick={() => setActiveTab("dashboard")} 
          className={`p-2 transition-colors ${activeTab === "dashboard" ? "text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
        >
          <Activity size={24} />
        </button>
        <button 
          onClick={() => setActiveTab("quests")} 
          className={`p-2 transition-colors ${activeTab === "quests" ? "text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
        >
          <Target size={24} />
        </button>
        <button
          type="button"
          onClick={() => setShowProductivityModal(true)}
          className="p-4 bg-slate-900 text-white rounded-full -mt-12 shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
        <button 
          onClick={() => setActiveTab("network")} 
          className={`p-2 transition-colors ${activeTab === "network" ? "text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
        >
          <Users size={24} />
        </button>
        <button 
          onClick={() => setActiveTab("settings")} 
          className={`p-2 transition-colors ${activeTab === "settings" ? "text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
        >
          <Settings size={24} />
        </button>
      </nav>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-6">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="relative w-16 h-16"
              >
                <div className="absolute inset-0 rounded-full border-[3px] border-slate-100" />
                <div className="absolute inset-0 rounded-full border-[3px] border-slate-900 border-t-transparent" />
              </motion.div>
              <div className="text-center space-y-2">
                <p className="text-slate-900 font-bold tracking-tight">유저 {user.uid.substring(0, 5)}님의 성장을 분석 중입니다...</p>
                <p className="text-xs text-slate-500 font-medium">AI가 최근 활동 내역을 종합하고 있습니다</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Modal / Toast view */}
      <AnimatePresence>
        {coachMessage && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50"
          >
            <div className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl border border-slate-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-400/30">
                <span className="text-lg">✨</span>
              </div>
              <div className="pt-0.5 w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-widest">일일 분석 리포트 확인 완료</span>
                  <button onClick={() => setCoachMessage(null)} className="text-slate-500 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <p className="font-semibold text-sm leading-relaxed break-keep">{coachMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProductivityModal && (
          <ProductivityChecklistModal userUid={user.uid} onClose={() => setShowProductivityModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
