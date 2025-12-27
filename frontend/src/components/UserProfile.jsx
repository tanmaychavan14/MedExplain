import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "./UserProfile.css";

export default function UserProfile({ user, onLogout }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error("Error signing out:", error);
      // Even if Firebase signout fails, still logout the user
      onLogout();
    }
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const photoURL = user?.photoURL || null;
  const email = user?.email || "";

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Default profile photo URL using a placeholder service if no photo
  const defaultPhotoURL = !photoURL 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=10b981&color=fff&size=128`
    : null;

  // Handle image load error - fallback to initials
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const placeholder = e.target.nextSibling;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  return (
    <div className="user-profile">
      <div className="user-info">
        {(photoURL || defaultPhotoURL) ? (
          <>
            <img 
              src={photoURL || defaultPhotoURL} 
              alt={displayName} 
              className="user-avatar" 
              onError={handleImageError}
              referrerPolicy="no-referrer"
            />
            <div className="user-avatar-placeholder" style={{ display: 'none' }}>
              {getInitials(displayName)}
            </div>
          </>
        ) : (
          <div className="user-avatar-placeholder">
            {getInitials(displayName)}
          </div>
        )}
        <div className="user-details">
          <span className="user-name">{displayName}</span>
          <span className="user-email">{email}</span>
        </div>
      </div>
      <button className="logout-btn" onClick={handleLogout} title="Sign out">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Logout
      </button>
    </div>
  );
}

