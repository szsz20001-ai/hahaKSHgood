import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Instagram, Youtube, Video, FileText, Twitter, Save, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { analyzeSnsActivityTEXT } from "../../services/geminiService";
import { syncSnsActivityLog } from "../../services/statEngine";

interface ConnectionsTabProps {
  userUid: string;
  currentProfile: any;
}

const SNS_PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500", bg: "bg-pink-50", hover: "hover:border-pink-200 hover:shadow-pink-100" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-500", bg: "bg-red-50", hover: "hover:border-red-200 hover:shadow-red-100" },
  { id: "tiktok", name: "TikTok", icon: Video, color: "text-slate-900", bg: "bg-slate-100", hover: "hover:border-slate-300 hover:shadow-slate-200" },
  { id: "naver_blog", name: "Naver Blog", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50", hover: "hover:border-emerald-200 hover:shadow-emerald-100" },
  { id: "x_twitter", name: "X (Twitter)", icon: Twitter, color: "text-blue-500", bg: "bg-blue-50", hover: "hover:border-blue-200 hover:shadow-blue-100" },
];

export function NetworkTab({ userUid, currentProfile }: ConnectionsTabProps) {
  const [snsInputs, setSnsInputs] = useState<Record<string, string>>(currentProfile?.sns_profiles || {});
  const [expandedSns, setExpandedSns] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (id: string, value: string) => {
    setSnsInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id: string) => {
    setIsSaving(true);
    try {
      const handle = snsInputs[id]?.trim();
      
      if (handle) {
        const platform = SNS_PLATFORMS.find(p => p.id === id);
        if (platform) {
          const mockMetadataText = `${platform.name} account ${handle} - Recent posts show strong involvement in their specific fields and daily consistencies.`;
          const analysis = await analyzeSnsActivityTEXT(platform.name, handle, mockMetadataText);
          
          await syncSnsActivityLog(userUid, platform.name, handle, analysis, currentProfile);
          alert(`${platform.name} 연결 성공!\n부여 스탯: ${analysis.assigned_stat} (+${analysis.score}%)`);
        }
      }

      const newSnsProfiles = {
        ...(currentProfile?.sns_profiles || {}),
        [id]: handle || ""
      };
      
      await updateDoc(doc(db, "users", userUid), {
        sns_profiles: newSnsProfiles
      });
      setExpandedSns(null);
    } catch (e: any) {
      alert(e.message || "연결 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasAnyLink = Object.keys(currentProfile?.sns_profiles || {}).length > 0 || Object.values(snsInputs).some(v => typeof v === 'string' && v.trim() !== "");

  const handleComplete = () => {
    const name = currentProfile?.displayName || "강PD";
    alert(`${name}님의 디지털 페르소나 연결을 완료했습니다.`);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 pt-8 space-y-6 pb-24"
    >
      <header className="text-center space-y-2 mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          [디지털 매체 연동]
        </h2>
        <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-sm mx-auto">
          다양한 플랫폼의 계정 아이디를 연동하여, 당신의 입체적 스탯을 증명하세요. API 연동을 통해 캡션, 이미지, 동영상을 다운로드 없이도 자동 반영합니다.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {SNS_PLATFORMS.map((platform) => {
          const isExpanded = expandedSns === platform.id;
          const isConnected = !!(currentProfile?.sns_profiles && currentProfile.sns_profiles[platform.id]);

          return (
            <motion.div
              layout
              key={platform.id}
              className={`col-span-1 rounded-[1.5rem] bg-[#F5F5F7] sm:bg-white border-2 overflow-hidden transition-all duration-300 ${isExpanded ? "col-span-2 sm:col-span-3 border-transparent bg-white shadow-xl shadow-slate-200/50" : `border-transparent shadow-sm ${platform.hover}`}`}
            >
              <button
                type="button"
                onClick={() => setExpandedSns(isExpanded ? null : platform.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between"
              >
                <div className="flex flex-col items-start gap-3">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-[1rem] ${platform.bg} border border-slate-100 shadow-sm`}>
                    <platform.icon size={24} className={platform.color} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight">{platform.name}</h3>
                    <p className={`text-[10px] font-bold mt-1 uppercase ${isConnected ? "text-emerald-500" : "text-slate-400"}`}>
                      {isConnected ? "Connected" : "Unlinked"}
                    </p>
                  </div>
                </div>
                {isConnected && !isExpanded && (
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0 self-start" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-5 pt-1 space-y-3 sm:px-5">
                      <div className="relative flex items-center">
                        <div className="absolute left-3 text-slate-400">
                          <LinkIcon size={16} />
                        </div>
                        <input
                          type="text"
                          value={snsInputs[platform.id] || ""}
                          onChange={(e) => handleInputChange(platform.id, e.target.value)}
                          placeholder="SNS 계정 아이디(ID) 입력"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl h-11 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
                        />
                        <button
                          onClick={() => handleSave(platform.id)}
                          disabled={isSaving}
                          className="absolute right-2 top-1.5 bottom-1.5 px-3 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-1"
                        >
                          <Save size={14} /> {isSaving ? "연동중" : "저장"}
                        </button>
                      </div>
                      <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 border border-indigo-200"></span>
                        아이디 연동 시 해당 매체의 최신 업데이트 내용(이미지, 동영상 등)이 STATURE 스탯에 반영됩니다.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="pt-6 sticky bottom-6 z-10"
      >
        <button
          onClick={handleComplete}
          disabled={!hasAnyLink}
          className="w-full py-4.5 rounded-[1.25rem] font-bold text-[15px] bg-slate-900 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] active:scale-[0.98] transition-all disabled:opacity-30 disabled:scale-100 disabled:shadow-none tracking-tight flex items-center justify-center gap-2"
        >
          {hasAnyLink ? "디지털 페르소나 완성하기" : "최소 1개의 매체를 연결해주세요"}
        </button>
      </motion.div>
    </motion.main>
  );
}
