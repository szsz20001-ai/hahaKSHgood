import React, { useState } from "react";
import { X, Network, Link, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { UserProfile } from "../types";
import { analyzeSnsActivityTEXT } from "../services/geminiService";
import { syncSnsActivityLog } from "../services/statEngine";

interface SnsSyncModalProps {
  userUid: string;
  currentProfile: UserProfile;
  onClose: () => void;
}

const PLATFORMS = [
  { id: "instagram", name: "Instagram", color: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500" },
  { id: "youtube", name: "YouTube", color: "bg-red-500" },
  { id: "tiktok", name: "TikTok", color: "bg-black" },
  { id: "naver_blog", name: "Naver Blog", color: "bg-[#03C75A]" },
  { id: "x", name: "X", color: "bg-slate-900" },
];

export function SnsSyncModal({ userUid, currentProfile, onClose }: SnsSyncModalProps) {
  const [links, setLinks] = useState<Record<string, string>>(currentProfile.sns_profiles || {});
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLinkChange = (id: string, value: string) => {
    setLinks(prev => ({ ...prev, [id]: value }));
  };

  const check1DayCache = (): boolean => {
    const lastScanStr = localStorage.getItem(`sns_scan_last_date_${userUid}`);
    if (!lastScanStr) return true;
    
    const lastScanDate = new Date(lastScanStr);
    const now = new Date();
    
    // Check if it's the same calendar day
    if (lastScanDate.getFullYear() === now.getFullYear() &&
        lastScanDate.getMonth() === now.getMonth() &&
        lastScanDate.getDate() === now.getDate()) {
      return false;
    }
    return true;
  };

  const handleScan = async () => {
    setErrorMsg("");
    
    if (!check1DayCache()) {
      setErrorMsg("정산은 하루에 한 번만 가능합니다. 내일 다시 시도해주세요.");
      return;
    }

    const activePlatforms = PLATFORMS.filter(p => links[p.id]?.trim());
    if (activePlatforms.length === 0) {
      setErrorMsg("연동할 SNS 프로필 핸들이나 링크를 1개 이상 입력해주세요.");
      return;
    }

    setIsScanning(true);

    try {
      let totalScore = 0;
      let targetStatKeys = new Set<string>();

      for (const platform of activePlatforms) {
        const handle = links[platform.id].trim();
        // [Stub for Beta]: Using handle as mock raw metadata text to simulate Gemini processing content. 
        // In real app, we'd fetch actual public posts here.
        const mockMetadataText = `${platform.name} account ${handle} - Recent posts show strong involvement in their specific fields and daily consistencies.`;
        
        const analysis = await analyzeSnsActivityTEXT(platform.name, handle, mockMetadataText);
        
        await syncSnsActivityLog(userUid, platform.name, handle, analysis, currentProfile);
        totalScore += analysis.score;
        targetStatKeys.add(analysis.assigned_stat);
      }

      localStorage.setItem(`sns_scan_last_date_${userUid}`, new Date().toISOString());

      setScanResult({
        totalScore,
        stats: Array.from(targetStatKeys).join(", ")
      });
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "스캔 중 오류가 발생했습니다.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-800">
                <Network size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">연동 및 커넥션 관리</h2>
              <p className="text-slate-500 text-sm mt-1">Linked profiles will be analyzed for growth stats.</p>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 mb-8">
            {PLATFORMS.map((platform) => (
              <div key={platform.id} className="flex bg-slate-50 p-3 rounded-2xl items-center gap-3">
                <div className={`w-10 h-10 ${platform.color} rounded-xl shrink-0 flex items-center justify-center`}>
                  <Link size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-400">{platform.name}</span>
                  <input 
                    type="text" 
                    placeholder="프로필 핸들 또는 URL" 
                    className="w-full bg-transparent border-none text-sm font-semibold outline-none text-slate-900 placeholder-slate-300 p-0"
                    value={links[platform.id] || ""}
                    onChange={(e) => handleLinkChange(platform.id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4 text-red-500 text-sm font-bold text-center">
                {errorMsg}
              </motion.div>
            )}
            {scanResult && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 p-4 bg-emerald-50 rounded-2xl flex items-center gap-3 text-emerald-800">
                <CheckCircle2 size={24} className="shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold">스캔 및 스탯 연동 완료!</p>
                  <p className="text-xs font-semibold opacity-80 mt-1">부여 스탯: {scanResult.stats} (+{scanResult.totalScore}%)</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!scanResult ? (
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  분석 중...
                </>
              ) : (
                "[스탯 연동 활성화]"
              )}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-emerald-600 text-white font-bold text-lg py-4 rounded-2xl hover:bg-emerald-700 transition-colors"
            >
              확인
            </button>
          )}

        </div>
      </motion.div>
    </div>
  );
}
