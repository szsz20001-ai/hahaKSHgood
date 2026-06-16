import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Lock, RefreshCcw, HelpCircle, LogOut, Briefcase, Sparkles, Check, X } from "lucide-react";
import type { User as FirebaseUser } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import type { UserProfile } from "../../types";
import { recommendJobByStats, type JobRecommendation } from "../../services/geminiService";

interface SettingsTabProps {
  user: FirebaseUser;
  profile: UserProfile;
  onLogout: () => void;
}

export function SettingsTab({ user, profile, onLogout }: SettingsTabProps) {
  const [jobInput, setJobInput] = useState(profile.job || "");
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [recommendation, setRecommendation] = useState<JobRecommendation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    const fetchAI = async () => {
      setIsLoadingAI(true);
      try {
        const res = await recommendJobByStats(profile.stats);
        setRecommendation(res);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingAI(false);
      }
    };
    fetchAI();
  }, [profile.stats]);

  const handleSaveJob = async () => {
    if (jobInput.trim() === profile.job) {
      setIsEditingJob(false);
      return;
    }
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        job: jobInput.trim(),
        updatedAt: new Date().toISOString()
      });
      setIsEditingJob(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto px-4 pt-6 pb-12 space-y-5"
    >
      <div className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
        <h2 className="text-xl font-black text-slate-900 border-b pb-4 border-slate-50 flex items-center justify-between">
          프로필 및 직업 설정
        </h2>
        
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-[1.5rem]">
          <img src={user.photoURL || ""} alt="Profile" className="w-14 h-14 rounded-full shadow-sm border-2 border-white" />
          <div className="flex-1">
            <p className="font-black text-lg text-slate-900 leading-tight">{user.displayName}</p>
            <p className="text-xs font-semibold text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-[1.5rem] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Briefcase size={14} /> 현재 설정된 직업</label>
            {!isEditingJob && (
              <button onClick={() => setIsEditingJob(true)} className="text-[10px] font-bold bg-white text-slate-900 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-900 hover:text-white transition-colors">기록 수정</button>
            )}
          </div>
          
          <AnimatePresence mode="popLayout">
            {isEditingJob ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <input
                  type="text"
                  value={jobInput}
                  onChange={e => setJobInput(e.target.value)}
                  placeholder="직업군명을 입력하세요"
                  autoFocus
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-slate-900 transition-colors"
                />
                <button onClick={handleSaveJob} disabled={isSaving} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-colors">
                  {isSaving ? <span className="block w-4 h-4 border-[2px] border-slate-100 border-t-slate-900 rounded-full animate-spin" /> : <Check size={16} />}
                </button>
                <button onClick={() => { setIsEditingJob(false); setJobInput(profile.job || ""); }} className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors">
                  <X size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-lg font-black text-slate-900">{profile.job || "미설정"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 p-5 sm:p-6 rounded-[2rem] border border-indigo-100 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Sparkles size={120} className="text-indigo-900 transform rotate-12" />
        </div>
        
        <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2 relative z-10"><Sparkles size={20} className="text-indigo-600" /> AI 맞춤 커리어 추천</h3>
        <p className="text-[11px] font-semibold text-indigo-800/80 leading-relaxed relative z-10">데이터 기반으로 분석된 당신의 무한 잠재력을 바탕으로 가장 완벽한 현실 시너지 직업 2가지를 제안합니다.</p>
        
        <div className="space-y-3 relative z-10">
          {isLoadingAI ? (
            <div className="animate-pulse space-y-3">
              <div className="h-24 bg-white/60 rounded-2xl w-full" />
              <div className="h-24 bg-white/60 rounded-2xl w-full" />
            </div>
          ) : recommendation ? (
            <>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onClick={() => { setJobInput(recommendation.job1); setIsEditingJob(true); }}>
                <h4 className="font-black text-base text-indigo-900 group-hover:text-indigo-600 transition-colors">{recommendation.job1}</h4>
                <p className="text-[11px] font-semibold text-slate-600 mt-1.5 leading-relaxed">{recommendation.reason1}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onClick={() => { setJobInput(recommendation.job2); setIsEditingJob(true); }}>
                <h4 className="font-black text-base text-indigo-900 group-hover:text-indigo-600 transition-colors">{recommendation.job2}</h4>
                <p className="text-[11px] font-semibold text-slate-600 mt-1.5 leading-relaxed">{recommendation.reason2}</p>
              </div>
            </>
          ) : (
             <div className="p-4 bg-white/50 text-center rounded-2xl text-xs font-bold text-slate-400 border border-white">추천을 불러올 수 없습니다.</div>
          )}
        </div>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="space-y-2">
          <SettingItem icon={Bell} label="푸시 알림 및 권한 설정" />
          <SettingItem icon={Lock} label="개인정보 처리방침" />
          <SettingItem icon={RefreshCcw} label="기기 데이터 동기화 관리" />
          <SettingItem icon={HelpCircle} label="고객지원 및 FAQ" />
        </div>

        <button 
          onClick={onLogout}
          className="w-full mt-6 py-4 flex items-center justify-center gap-2 text-rose-500 font-bold bg-rose-50 hover:bg-rose-100 rounded-2xl transition-colors"
        >
          <LogOut size={18} /> 로그아웃
        </button>
      </div>
    </motion.main>
  );
}

function SettingItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all text-slate-600">
          <Icon size={18} />
        </div>
        <span className="font-bold text-sm text-slate-700">{label}</span>
      </div>
    </button>
  );
}
