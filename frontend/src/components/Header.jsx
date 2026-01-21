// components/Header.jsx
import { LogOut, Stethoscope, Phone, AlertCircle, X, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SleepGuideModal from "./SleepGuideModal";

export default function Header({ user, onLogout }) {
  const [showEmergency, setShowEmergency] = useState(false);
  const [showSleepGuide, setShowSleepGuide] = useState(false);
  const emergencyRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (emergencyRef.current && !emergencyRef.current.contains(event.target)) {
        setShowEmergency(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const emergencyNumbers = [
    {
      category: "Critical Response",
      items: [
        { label: "National Emergency", number: "112" },
        { label: "Ambulance", number: "102" },
        { label: "Medical & Fire", number: "108" },
      ]
    },
    {
      category: "Helplines",
      items: [
        { label: "Health Info (National)", number: "1075" },
        { label: "Mental Health (24/7)", number: "14416" },
        { label: "Women Helpline", number: "1091" },
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b-[1.5px] border-[var(--color-surface-200)] supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">

          {/* Logo Section */}
          <div className="flex items-center gap-3.5 group cursor-default">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--color-primary)] text-white shadow-md shadow-teal-900/10 transition-transform group-hover:scale-105 duration-300">
              <Stethoscope className="w-6 h-6 stroke-[2]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-[3px] border-[var(--color-primary)]" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight leading-none">
                MEDEXPLAIN
              </h1>
              <span className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mt-0.5 group-hover:text-[var(--color-primary)] transition-colors">
                Simple Health Reports
              </span>
            </div>
          </div>

          {/* User Section */}
          {user && (
            <div className="flex items-center gap-2 sm:gap-5 relative">

              {/* Sleep Guide Button */}
              <button
                onClick={() => setShowSleepGuide(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
                title="Sleep Guide"
              >
                <Moon className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline tracking-wide">Sleep Guide</span>
              </button>

              {/* Emergency SOS Button */}
              <div className="relative" ref={emergencyRef}>
                <button
                  onClick={() => setShowEmergency(!showEmergency)}
                  className={`
                    flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border
                    ${showEmergency
                      ? "bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error)] shadow-inner"
                      : "bg-white border-transparent text-[var(--color-error)] hover:bg-[var(--color-error-bg)] hover:border-red-200 hover:shadow-sm"}
                  `}
                  title="Emergency Helplines"
                >
                  <Phone className="w-4 h-4 fill-current animate-pulse" />
                  <span className="hidden sm:inline tracking-wide">SOS</span>
                </button>

                {/* Emergency Popup */}
                {showEmergency && (
                  <div className="absolute right-[-60px] sm:right-0 top-full mt-3 w-[85vw] sm:w-80 bg-white rounded-2xl shadow-xl border border-[var(--color-surface-200)] overflow-hidden animate-enter z-[60] ring-1 ring-black/5">
                    <div className="p-4 bg-[var(--color-error-bg)] border-b border-red-100 flex justify-between items-center">
                      <h3 className="font-bold text-red-900 flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-[var(--color-error)]" />
                        Emergency Resources
                      </h3>
                      <button
                        onClick={() => setShowEmergency(false)}
                        className="p-1 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-700 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                      {emergencyNumbers.map((group, idx) => (
                        <div key={idx} className="mb-2 last:mb-0">
                          <h4 className="px-3 py-2 text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                            {group.category}
                          </h4>
                          <div className="space-y-1">
                            {group.items.map((item, itemIdx) => (
                              <div
                                key={itemIdx}
                                className="flex items-center justify-between p-2.5 mx-1 rounded-lg hover:bg-[var(--color-surface-50)] border border-transparent hover:border-[var(--color-surface-200)] transition-all cursor-pointer group"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.number);
                                }}
                              >
                                <span className="text-sm font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
                                  {item.label}
                                </span>
                                <span className="font-mono text-sm font-bold text-[var(--color-text-primary)] bg-[var(--color-surface-100)] px-2 py-0.5 rounded text-center min-w-[3.5rem] group-hover:text-white group-hover:bg-[var(--color-error)] transition-colors shadow-sm">
                                  {item.number}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 bg-[var(--color-surface-50)] text-[10px] text-center text-[var(--color-text-tertiary)] border-t border-[var(--color-surface-200)] font-medium">
                      Click any number to copy instantly
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-[var(--color-surface-200)] hidden sm:block"></div>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="relative group cursor-pointer">
                  <div className="p-[1px] rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-cyan-300">
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=0d9488&color=fff`}
                      alt="Profile"
                      className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm transition-transform group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--color-success)] border-2 border-white rounded-full shadow-sm"></div>
                </div>

                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-bold text-[var(--color-text-primary)] leading-tight">
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text-tertiary)]">
                    Online
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-[var(--color-surface-200)] hidden sm:block mx-1"></div>

              <button
                onClick={onLogout}
                className="group flex items-center gap-2 px-3 py-2 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-lg transition-all duration-200"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sleep Guide Modal */}
      {showSleepGuide && <SleepGuideModal onClose={() => setShowSleepGuide(false)} />}
    </header>
  );
}
