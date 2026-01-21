// components/Login.jsx
import { useState } from "react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../../firebase";
import { Mail, Shield, User, ArrowRight, Loader, AlertCircle } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showNormalLogin, setShowNormalLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    try {
      setError("");
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await saveUserToFirestore(user);
      onLogin(user);
    } catch (err) {
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  }

  async function saveUserToFirestore(user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || username || user.email?.split("@")[0] || "User",
          photoURL: user.photoURL || null,
          createdAt: new Date().toISOString(),
          provider: user.providerData[0]?.providerId || "email"
        });
      } else {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || userSnap.data().displayName,
          photoURL: user.photoURL || userSnap.data().photoURL,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (err) {
      console.error("Firestore Error:", err);
    }
  }

  async function handleEmailAuth(isSignUpMode) {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setError("");
      setLoading(true);

      let user;
      if (isSignUpMode) {
        if (password.length < 6) throw new Error("Password must be at least 6 chars");
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        user = credential.user;
        if (username.trim()) {
          await updateProfile(user, { displayName: username.trim() });
          await user.reload();
        }
      } else {
        const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
        user = credential.user;
      }

      await saveUserToFirestore(user);
      onLogin(user);
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome to MedExplain
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Sign in to analyze and manage medical reports
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!showNormalLogin ? (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium shadow-sm hover:bg-slate-50 hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-400">or continue with</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowNormalLogin(true);
                setIsSignUp(false);
                setError("");
              }}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all hover:-translate-y-0.5"
            >
              <Mail className="w-5 h-5" />
              <span>Sign in with Email</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleEmailAuth(isSignUp)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/20 hover:bg-teal-500 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-sm text-slate-600 hover:text-teal-600 font-medium transition-colors"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>

              <button
                onClick={() => {
                  setShowNormalLogin(false);
                  setIsSignUp(false);
                  setError("");
                  setEmail("");
                  setPassword("");
                }}
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Back to all options
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Decoration */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400">
          Professional Medical Reports Analysis Platform
        </p>
      </div>
    </div>
  );
}
