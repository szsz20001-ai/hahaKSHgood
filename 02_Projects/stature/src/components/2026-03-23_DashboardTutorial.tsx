import { motion } from "motion/react";

const OVERLAY_BG = "rgba(0, 0, 0, 0.7)";

interface DashboardTutorialProps {
  onDismiss: () => void;
}

export function DashboardTutorial({ onDismiss }: DashboardTutorialProps) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dashboard-tutorial-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ backgroundColor: OVERLAY_BG }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-slate-800/95 to-slate-900/95 shadow-2xl backdrop-blur-md px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex items-stretch gap-2 sm:gap-3">
            <span
              className="font-mono text-3xl sm:text-4xl font-light text-slate-400 leading-none select-none"
              aria-hidden
            >
              [
            </span>
            <div className="min-w-0 flex-1 space-y-4 text-center">
              <p
                id="dashboard-tutorial-title"
                className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
              >
                Welcome
              </p>
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-medium">
                STATURE에 오신 것을 환영합니다. 다이어그램을 통해 당신의 현재 스탯을 확인하고,
                하단의 퀘스트를 통해 능력치를 증명하세요.
              </p>
            </div>
            <span
              className="font-mono text-3xl sm:text-4xl font-light text-slate-400 leading-none select-none"
              aria-hidden
            >
              ]
            </span>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex items-stretch gap-2">
              <span className="font-mono text-xl text-slate-500 leading-none select-none">[</span>
              <button
                type="button"
                onClick={onDismiss}
                className="px-8 py-3 rounded-xl font-black text-sm tracking-tight bg-white text-slate-900 hover:bg-slate-100 transition-colors"
              >
                확인
              </button>
              <span className="font-mono text-xl text-slate-500 leading-none select-none">]</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
