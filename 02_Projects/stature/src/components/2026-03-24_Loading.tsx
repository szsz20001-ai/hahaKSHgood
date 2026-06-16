import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

const DAILY_WORDS = [
  "육아", "살림", "야근", "마감", "공부", "운동", "현장", 
  "땀방울", "미팅", "통근", "가사", "헌신", "반복", "일상"
];

interface LoadingProps {
  onComplete?: () => void;
  isQuick?: boolean;
}

/**
 * Cinematic Loading Sequence:
 * 1. Word Cloud (Random words fly to center)
 * 2. Convergence (Words fade/implode)
 * 3. Grand Message (Scales up)
 * 4. Logo Reveal (Final brand)
 */
export function Loading({ onComplete, isQuick = false }: LoadingProps) {
  const [stage, setStage] = useState<"words" | "message" | "logo">("words");

  // Generate random positions and delays for the word cloud once
  const words = useMemo(() => {
    return DAILY_WORDS.map((text, i) => ({
      text,
      id: i,
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      rotate: (Math.random() - 0.5) * 60,
      delay: Math.random() * 0.8,
      duration: 1.2 + Math.random() * 0.8,
    }));
  }, []);

  useEffect(() => {
    if (isQuick) return;

    // Stage 1 -> 2: Words to Message (after words have settled a bit)
    const toMessage = setTimeout(() => {
      setStage("message");
    }, 4500);

    // Stage 2 -> 3: Message to Logo
    const toLogo = setTimeout(() => {
      setStage("logo");
    }, 9500);

    // Final Complete
    const toComplete = setTimeout(() => {
      if (onComplete) onComplete();
    }, 12500);

    return () => {
      clearTimeout(toMessage);
      clearTimeout(toLogo);
      clearTimeout(toComplete);
    };
  }, [onComplete, isQuick]);

  if (isQuick) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
        <div className="w-48 h-[3px] bg-slate-100 rounded-full overflow-hidden mb-6">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-slate-900 rounded-full"
          />
        </div>
        <p className="text-slate-700 font-semibold text-[15px] leading-relaxed tracking-wide text-center px-6">
          육아, 살림, 그리고 당신이 흘린 현장의 땀방울...<br />그 모든 헌신은 당신의 위대한 업적입니다.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white overflow-hidden select-none">
      
      <AnimatePresence mode="wait">
        {stage === "words" && (
          <motion.div
            key="words-stage"
            className="absolute inset-0 flex items-center justify-center"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
            transition={{ duration: 0.8 }}
          >
            {words.map((w) => (
              <motion.span
                key={w.id}
                initial={{ opacity: 0, x: w.x, y: w.y, scale: 0.5, rotate: w.rotate }}
                animate={{ opacity: [0, 0.4, 0.2], x: 0, y: 0, scale: 1, rotate: 0 }}
                transition={{ duration: w.duration, delay: w.delay, ease: [0.16, 1, 0.3, 1] }}
                className="absolute text-slate-300 font-bold text-xl sm:text-2xl whitespace-nowrap"
                style={{ left: "50%", top: "50%", marginLeft: "-1em", marginTop: "-0.5em" }}
              >
                {w.text}
              </motion.span>
            ))}
          </motion.div>
        )}

        {stage === "message" && (
          <motion.div
            key="message-stage"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1.1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="px-8 text-center max-w-2xl absolute"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tighter break-keep">
              반복되는 일상의 모든 것이<br />
              당신의 능력, 업적이 되는 곳
            </h2>
          </motion.div>
        )}

        {stage === "logo" && (
          <motion.div
            key="logo-stage"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-8 absolute"
          >
             <div className="relative w-32 h-32 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute w-full h-full border border-slate-200 rounded-[35%] opacity-40"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="absolute w-[80%] h-[80%] border-2 border-slate-900 rounded-[40%] opacity-60"
              />
              <div className="absolute w-8 h-8 bg-slate-900 rounded-full shadow-xl" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">
              STATURE
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative background ambient */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-slate-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
    </div>
  );
}
