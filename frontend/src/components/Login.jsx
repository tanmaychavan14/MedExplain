import { useState } from "react";
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../../firebase";
import "./Login.css";

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
      
      // Store user data in Firestore (same as email/password)
      await saveUserToFirestore(user);
      
      onLogin(user);
    } catch (err) {
      setError(err.message || "Failed to sign in with Google. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveUserToFirestore(user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || username || user.email?.split("@")[0] || "User",
          photoURL: user.photoURL || null,
          createdAt: new Date().toISOString(),
          provider: user.providerData[0]?.providerId || "email"
        });
      } else {
        // Update existing user document
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || userSnap.data().displayName,
          photoURL: user.photoURL || userSnap.data().photoURL,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (err) {
      console.error("Error saving user to Firestore:", err);
      // Don't throw - user is still logged in
    }
  }

  async function handleEmailSignUp() {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      setLoading(true);
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      let user = userCredential.user;

      // Update profile with username if provided
      if (username.trim()) {
        try {
          await updateProfile(user, {
            displayName: username.trim()
          });
          // Reload user to get updated profile
          await user.reload();
          user = auth.currentUser;
        } catch (profileError) {
          console.warn("Failed to update profile, continuing anyway:", profileError);
          // Continue even if profile update fails
        }
      }

      // Store user data in Firestore
      try {
        await saveUserToFirestore(user);
      } catch (firestoreError) {
        console.warn("Failed to save to Firestore, continuing anyway:", firestoreError);
        // Continue even if Firestore save fails - user is still authenticated
      }

      onLogin(user);
    } catch (err) {
      console.error("Sign up error:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      
      let errorMessage = "Failed to create account. Please try again.";
      
      // Handle specific Firebase Auth error codes
      if (err.code) {
        switch (err.code) {
          case "auth/email-already-in-use":
            errorMessage = "This email is already registered. Please sign in instead.";
            break;
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address.";
            break;
          case "auth/weak-password":
            errorMessage = "Password is too weak. Please use a stronger password (at least 6 characters).";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "Email/password accounts are not enabled. Please contact support.";
            break;
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your internet connection and try again.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many requests. Please try again later.";
            break;
          default:
            errorMessage = err.message || `Failed to create account: ${err.code || "Unknown error"}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailSignIn() {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setError("");
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Update user data in Firestore
      await saveUserToFirestore(user);

      onLogin(user);
    } catch (err) {
      console.error("Sign in error:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      
      let errorMessage = "Failed to sign in. Please try again.";
      
      // Handle specific Firebase Auth error codes
      if (err.code) {
        switch (err.code) {
          case "auth/user-not-found":
            errorMessage = "No account found with this email. Please sign up first.";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password. Please try again.";
            break;
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address.";
            break;
          case "auth/invalid-credential":
            errorMessage = "Invalid email or password. Please try again.";
            break;
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your internet connection and try again.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many requests. Please try again later.";
            break;
          case "auth/user-disabled":
            errorMessage = "This account has been disabled. Please contact support.";
            break;
          default:
            errorMessage = err.message || `Failed to sign in: ${err.code || "Unknown error"}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-card">
      <div className="login-header">
        <h2>Welcome to MedExplain</h2>
        <p className="login-subtitle">Sign in to upload and view medical reports</p>
      </div>

      {error && (
        <div className="login-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      {!showNormalLogin ? (
        <div className="login-options">
          <button 
            className="login-btn login-btn-google" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Sign in with Google
          </button>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button 
            className="login-btn login-btn-email" 
            onClick={() => {
              setShowNormalLogin(true);
              setIsSignUp(false);
              setError("");
            }}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Sign in with Email
          </button>
        </div>
      ) : (
        <div className="login-form">
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="Enter your username"
                className="form-input"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email"
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              className="form-input"
              disabled={loading}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  isSignUp ? handleEmailSignUp() : handleEmailSignIn();
                }
              }}
            />
          </div>

          <button 
            className="login-btn login-btn-primary" 
            onClick={isSignUp ? handleEmailSignUp : handleEmailSignIn}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </>
            ) : (
              isSignUp ? "Create Account" : "Sign In"
            )}
          </button>

          <div className="login-form-footer">
            <button 
              className="login-link-btn"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              disabled={loading}
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Sign up"}
            </button>
            <button 
              className="login-link-btn"
              onClick={() => {
                setShowNormalLogin(false);
                setEmail("");
                setPassword("");
                setUsername("");
                setIsSignUp(false);
                setError("");
              }}
              disabled={loading}
            >
              Back to login options
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
