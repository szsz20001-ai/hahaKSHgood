// Last Updated: 2026-03-25 (Pro Tier Deployment)
import React, { useEffect, useLayoutEffect, useState, Suspense } from "react";
import { 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc,
} from "firebase/firestore";
import { auth, db, loginWithGoogle, logout } from "./firebase";
import { UserProfile, Stats, isProfileDemographicsComplete } from "./types";
import { getInitialStats } from "./services/statEngine";
import { Onboarding, type OnboardingData } from "./components/Onboarding";
import { DashboardTutorial } from "./components/DashboardTutorial";
import { Loading } from "./components/Loading";
import { motion, AnimatePresence } from "motion/react";

const MainDashboard = React.lazy(() => import('./components/MainDashboard').then(m => ({ default: m.MainDashboard })));

const TUTORIAL_STORAGE_KEY = (uid: string) => `stature:dashboardTutorial:${uid}`;

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [oobeDone, setOobeDone] = useState(false);
  const [selectedStat, setSelectedStat] = useState<keyof Stats | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);

  const subscribeToProfile = (firebaseUser: Partial<User>) => {
    const userRef = doc(db, "users", firebaseUser.uid!);
    const unsubProfile = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<UserProfile>;
        const missingStats = !data.stats;
        const missingRawScores = !data.rawScores;
        const missingTimestamps = typeof data.createdAt !== "string" || typeof data.updatedAt !== "string";

        const nextProfile: UserProfile = {
          ...(data as UserProfile),
          uid: data.uid ?? firebaseUser.uid!,
          stats: (missingStats ? getInitialStats() : data.stats as Stats) as Stats,
          rawScores: (missingRawScores ? {} : data.rawScores as Record<string, number>) as Record<string, number>,
          createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
          updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
        };

        if (missingStats || missingRawScores || missingTimestamps) {
          setDoc(userRef, {
            uid: nextProfile.uid,
            stats: nextProfile.stats,
            rawScores: nextProfile.rawScores,
            createdAt: nextProfile.createdAt,
            updatedAt: nextProfile.updatedAt,
          }, { merge: true }).catch(() => {});
        }
        setProfile(nextProfile);
      } else {
        const newProfile: Partial<UserProfile> = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || "Anonymous",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || "",
          stats: getInitialStats(),
          rawScores: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setDoc(userRef, newProfile);
      }
      setLoading(false);
    });
    return unsubProfile;
  };

  const renderInAppBrowserWarning = () => {
    const ua = navigator.userAgent.toLowerCase();
    const isKakao = ua.includes("kakaotalk");
    const isInstagram = ua.includes("instagram");
    
    if (isKakao) {
      window.location.href = "kakaotalk://web/openExternal?url=" + encodeURIComponent(window.location.href);
    }
    
    if (isKakao || isInstagram) {
      return (
        <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-3xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">현재 브라우저에서는<br/>로그인이 지원되지 않습니다.</h2>
          <p className="text-slate-300 font-medium mb-8">
            카카오톡/인스타그램 브라우저에서는 구글 로그인이 차단됩니다.<br/><br/>
            우측 하단(또는 상단)의 <strong>[ ⋯ ]</strong> 메뉴를 눌러<br/>
            <strong>[ 다른 브라우저로 열기 ]</strong> 또는 <strong>[ Safari로 열기 ]</strong>를<br/>
            선택해주세요!
          </p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        localStorage.setItem("stature_session_active", "true");
        return subscribeToProfile(firebaseUser);
      } else {
        setProfile(null);
        setLoading(false);
        if (!localStorage.getItem("stature_session_active")) {
          setOobeDone(true);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useLayoutEffect(() => {
    if (!user || !profile || !isProfileDemographicsComplete(profile)) {
      setShowTutorial(false);
      return;
    }
    try {
      const seen = localStorage.getItem(TUTORIAL_STORAGE_KEY(user.uid));
      setShowTutorial(!seen);
    } catch {
      setShowTutorial(false);
    }
  }, [user, profile]);

  const handleOnboardingComplete = (data: OnboardingData) => {
    if (!user) return;
    
    // 1. 즉각적인 상태 업데이트 (UX 최우선 - UI 먹통 방지)
    setProfile(prev => prev ? {
      ...prev,
      ageRange: data.ageRange,
      gender: data.gender,
      job: data.job,
      is_onboarding_complete: true
    } : null);

    // 2. 백그라운드 저장을 통한 비동기 병렬 처리 및 재시도 로직
    const saveToFirestore = async (retries = 3) => {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          ageRange: data.ageRange,
          gender: data.gender,
          job: data.job,
          is_onboarding_complete: true,
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error("Failed to save onboarding profile:", e);
        if (retries > 0) {
          setTimeout(() => saveToFirestore(retries - 1), 2000);
        }
      }
    };
    
    saveToFirestore();
  };

  const dismissDashboardTutorial = () => {
    if (user) {
      try {
        localStorage.setItem(TUTORIAL_STORAGE_KEY(user.uid), "1");
      } catch {
        /* ignore */
      }
    }
    setShowTutorial(false);
  };

  const renderContent = () => {
    const inAppWarning = renderInAppBrowserWarning();
    if (inAppWarning) return inAppWarning;

    if (loading || !oobeDone) {
      return (
        <Loading 
          onComplete={() => setOobeDone(true)} 
        />
      );
    }

  const handleSecretClick = async () => {
    const next = secretClicks + 1;
    setSecretClicks(next);
    if (next >= 10) {
      setSecretClicks(0);
      try {
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        await signInWithEmailAndPassword(auth, "admin0720@stature.com", "100M$hoonk").catch((e) => {
          console.warn("Real auth failed, falling back to mock or treating as missing user.", e);
          // If the admin user is not registered, we can just login with google or show alert
          alert("Admin 계정이 존재하지 않거나 비밀번호가 틀렸습니다. (admin0720@stature.com / 100M$hoonk)");
        });
      } catch (e) {
        console.error("Backdoor error", e);
      }
    }
  };

    if (!user) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 pb-12 pt-24 sm:pt-32 p-6 relative">
          <div className="w-full max-w-sm flex flex-col items-center">
            {/* Logo area */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-12 sm:mb-16 flex items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="absolute w-full h-full border border-slate-200 rounded-[35%] opacity-60" />
              <div className="absolute w-12 h-12 bg-slate-900 rounded-full" />
            </div>

            <div className="text-center space-y-3 mb-10">
              <h1 className="text-5xl font-black tracking-tighter">STATURE</h1>
              <p className="text-slate-500 font-semibold text-sm">성장의 여정을 계속하세요.</p>
            </div>

            <button 
              onClick={loginWithGoogle}
              className="w-full py-4.5 bg-slate-900 hover:bg-black text-white rounded-[1.25rem] font-bold text-[15px] flex items-center justify-center gap-3 transition-colors active:scale-95"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="Google" />
              구글 계정으로 시작하기
            </button>
          </div>
          <div 
            onClick={handleSecretClick}
            className="absolute bottom-6 right-6 text-xs text-slate-300 font-medium cursor-pointer select-none"
          >
            Maker HoonK
          </div>
        </div>
      );
    }

    if (user && !profile) {
      return <Loading isQuick={true} />;
    }

    if (user && profile && !profile.is_onboarding_complete) {
      return (
        <div className="relative">
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      );
    }

    return (
      <Suspense fallback={<Loading isQuick={true} />}>
        {showTutorial && user && profile && (
          <AnimatePresence>
            <DashboardTutorial onDismiss={dismissDashboardTutorial} />
          </AnimatePresence>
        )}
        <MainDashboard
          user={user}
          profile={profile}
          selectedStat={selectedStat}
          onSelectStat={setSelectedStat}
          onLogout={() => {
            logout().then(() => {
              localStorage.removeItem("stature_session_active");
              window.location.reload();
            });
          }}
        />
      </Suspense>
    );
  };

  return renderContent();
}
// Trigger rebuild: Vercel cache issue Wed Mar 25 17:31:22 KST 2026
