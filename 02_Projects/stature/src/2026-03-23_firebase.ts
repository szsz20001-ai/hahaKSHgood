import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDu0blPjIgX64W25PoUNOs-D9f6XDyKNz4",
  authDomain: "stature-b27e2.firebaseapp.com",
  projectId: "stature-b27e2",
  storageBucket: "stature-b27e2.firebasestorage.app",
  messagingSenderId: "465768924899",
  appId: "1:465768924899:web:71a3ef4e3e3371643967d6",
  measurementId: "G-WCFGRTRG4W",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/calendar.events");
googleProvider.addScope("https://www.googleapis.com/auth/calendar.readonly");

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Firebase configuration error: client is offline.");
    }
  }
}
testConnection();

let isLoggingIn = false;

export const loginWithGoogle = async () => {
  if (isLoggingIn) return;
  isLoggingIn = true;
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      localStorage.setItem("google_access_token", credential.accessToken);
    }
  } catch (error: any) {
    // User closed the popup — not a real error
    if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") {
      return;
    }
    console.error("Google Login Error:", error);
    alert(`로그인 실패: ${error.message || "네트워크 문제로 예상됩니다."}`);
    throw error;
  } finally {
    isLoggingIn = false;
  }
};

export const logout = async () => {
  localStorage.removeItem("google_access_token");
  return signOut(auth);
};
