import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "motion/react";

/** Firebase 등에 저장하기 좋은 문자열 리터럴 */
export type OnboardingAgeRange = "10대" | "20대" | "30대" | "40대" | "50대 이상";
export type OnboardingGender = "남성" | "여성" | "비공개";

export interface OnboardingData {
  ageRange: OnboardingAgeRange;
  gender: OnboardingGender;
  job: string;
}

const AGE_OPTIONS: OnboardingAgeRange[] = [
  "10대",
  "20대",
  "30대",
  "40대",
  "50대 이상",
];

const GENDER_OPTIONS: OnboardingGender[] = ["남성", "여성", "비공개"];

interface BracketFrameProps {
  children: ReactNode;
  className?: string;
}

function BracketFrame({ children, className = "" }: BracketFrameProps) {
  return (
    <div
      className={`flex items-stretch gap-1 sm:gap-2 ${className}`}
    >
      <span
        className="font-mono text-2xl sm:text-3xl font-light text-slate-500/90 leading-none select-none tabular-nums"
        aria-hidden
      >
        [
      </span>
      <div className="min-w-0 flex-1 flex items-center">{children}</div>
      <span
        className="font-mono text-2xl sm:text-3xl font-light text-slate-500/90 leading-none select-none tabular-nums"
        aria-hidden
      >
        ]
      </span>
    </div>
  );
}

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [ageRange, setAgeRange] = useState<OnboardingAgeRange | "">("");
  const [gender, setGender] = useState<OnboardingGender | null>(null);
  const [job, setJob] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const jobTrimmed = job.trim();
  const isValid =
    ageRange !== "" && gender !== null && jobTrimmed.length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    if (!isValid || !gender) return;
    onComplete({
      ageRange,
      gender,
      job: jobTrimmed,
    });
  };

  const showError = attemptedSubmit && !isValid;

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(145deg,#e4e6ea_0%,#c9cdd5_35%,#dfe2e8_70%,#d1d5dd_100%)] text-slate-900 flex flex-col items-center justify-center p-6 sm:p-10">
      {/* 메탈릭 하이라이트 오버레이 */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#ffffff_0%,transparent_55%)]"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <header className="text-center mb-10 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-600/90">
            Initial Profile
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900">
            STATURE
          </h1>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            프로필을 설정하고 스테이처를 시작하세요.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 연령대 */}
          <div className="space-y-2">
            <label
              htmlFor="onboarding-age"
              className="block text-xs font-bold uppercase tracking-widest text-slate-600 ml-1"
            >
              연령대
            </label>
            <div
              className="rounded-2xl border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_4px_24px_rgba(15,23,42,0.08)] bg-gradient-to-b from-white/55 to-slate-200/50 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-3.5"
            >
              <BracketFrame>
                <select
                  id="onboarding-age"
                  value={ageRange}
                  onChange={(e) =>
                    setAgeRange(e.target.value as OnboardingAgeRange | "")
                  }
                  className="w-full bg-transparent text-slate-900 font-semibold text-sm sm:text-base outline-none cursor-pointer appearance-none pr-8 py-1 rounded-lg focus:ring-2 focus:ring-slate-400/50"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.25rem center",
                  }}
                >
                  <option value="" disabled>
                    연령대를 선택하세요
                  </option>
                  {AGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </BracketFrame>
            </div>
          </div>

          {/* 성별 */}
          <div className="space-y-2">
            <span className="block text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">
              성별
            </span>
            <div
              className="rounded-2xl border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_4px_24px_rgba(15,23,42,0.08)] bg-gradient-to-b from-white/55 to-slate-200/50 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-3.5"
            >
              <BracketFrame>
                <div className="flex flex-wrap gap-2 w-full">
                  {GENDER_OPTIONS.map((g) => {
                    const active = gender === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`flex-1 min-w-[5.5rem] py-2.5 px-3 rounded-xl text-sm font-bold transition-all border ${
                          active
                            ? "bg-slate-900 text-white border-slate-900 shadow-md"
                            : "bg-white/40 text-slate-700 border-slate-400/40 hover:bg-white/70 hover:border-slate-400/60"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </BracketFrame>
            </div>
          </div>

          {/* 직업군 */}
          <div className="space-y-2">
            <label
              htmlFor="onboarding-job"
              className="block text-xs font-bold uppercase tracking-widest text-slate-600 ml-1"
            >
              직업군
            </label>
            <div
              className="rounded-2xl border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_4px_24px_rgba(15,23,42,0.08)] bg-gradient-to-b from-white/55 to-slate-200/50 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-3.5"
            >
              <BracketFrame>
                <input
                  id="onboarding-job"
                  type="text"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  placeholder="예: 마케팅 매니저, 영상 편집자"
                  autoComplete="organization-title"
                  className="w-full bg-transparent placeholder:text-slate-500/80 text-slate-900 font-medium text-sm sm:text-base outline-none py-1 rounded-lg focus:ring-2 focus:ring-slate-400/50"
                />
              </BracketFrame>
            </div>
          </div>

          {showError && (
            <p className="text-center text-xs font-semibold text-red-800/90">
              연령대, 성별, 직업군을 모두 입력해 주세요.
            </p>
          )}

          <div className="pt-2">
            <div className="rounded-2xl border border-slate-400/30 shadow-[0_8px_32px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.5)] bg-gradient-to-b from-slate-100/90 to-slate-300/80 p-1">
              <BracketFrame className="px-1 py-1">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-black text-sm sm:text-base tracking-tight text-slate-950 bg-gradient-to-b from-white/90 to-slate-200/90 border border-white/60 shadow-sm hover:from-white hover:to-slate-100 active:scale-[0.99] transition-all"
                >
                  [스테이처 시작하기]
                </button>
              </BracketFrame>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Onboarding;
