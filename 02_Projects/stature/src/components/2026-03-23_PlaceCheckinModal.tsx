import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGoogleMapsScript } from "../hooks/useGoogleMapsScript";
import { addCheckinActivity } from "../services/statEngine";
import type { UserProfile } from "../types";

const OVERLAY_BG = "rgba(0, 0, 0, 0.7)";

interface PlaceCheckinModalProps {
  userUid: string;
  currentProfile: UserProfile;
  onClose: () => void;
}

export function PlaceCheckinModal({ userUid, currentProfile, onClose }: PlaceCheckinModalProps) {
  const isLoaded = useGoogleMapsScript();
  const inputRef = useRef<HTMLInputElement>(null);

  const [placeName, setPlaceName] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [duration, setDuration] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isLoaded && inputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["establishment", "geocode"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.name) {
          setPlaceName(place.name);
        } else if (inputRef.current) {
          setPlaceName(inputRef.current.value);
        }
      });
    }
  }, [isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeName || !visitDate || !duration) return;

    setIsSaving(true);
    try {
      await addCheckinActivity(userUid, placeName, visitDate, parseInt(duration, 10), currentProfile);
      onClose();
    } catch (err) {
      console.error("Failed to add check-in:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      role="dialog"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ backgroundColor: OVERLAY_BG }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-5 text-slate-400 hover:text-slate-900 transition-colors font-mono text-xl"
        >
          ✕
        </button>

        <h3 className="text-xl font-black mb-6 text-slate-900 border-b pb-4 border-slate-100 flex items-center gap-2">
          구글 맵 장소 체크인
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">장소 검색</label>
            <input
              ref={inputRef}
              type="text"
              placeholder={isLoaded ? "장소를 검색하세요" : "Google Maps 로딩중..."}
              disabled={!isLoaded}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
              onChange={(e) => setPlaceName(e.target.value)}
              onCompositionEnd={(e) => setPlaceName((e.target as HTMLInputElement).value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">방문 날짜</label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">소요 시간 (분)</label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="예: 60"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSaving || !placeName || !visitDate || !duration}
            className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? "저장 중..." : "[체크인 인증 완료]"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
