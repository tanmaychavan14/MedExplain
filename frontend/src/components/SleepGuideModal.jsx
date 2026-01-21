import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Moon, Clock, Brain, Smartphone, Sun, Battery, AlertTriangle, ChevronRight, Quote } from "lucide-react";

export default function SleepGuideModal({ onClose }) {
    const [activeTab, setActiveTab] = useState("hygiene");
    const modalRef = useRef(null);

    const tabs = [
        { id: "hygiene", label: "Sleep Hygiene", icon: Moon, color: "text-indigo-600", bg: "bg-indigo-50" },
        { id: "hours", label: "Ideal Hours", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
        { id: "cycle", label: "Sleep Cycle", icon: Brain, color: "text-violet-600", bg: "bg-violet-50" },
        { id: "myths", label: "Phone Myths", icon: Smartphone, color: "text-rose-600", bg: "bg-rose-50" },
    ];

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Prevent scrolling on body when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div
                ref={modalRef}
                className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-300 ring-1 ring-white/20"
            >

                {/* Mobile Header / Close Button */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-100 bg-white z-20 shrink-0">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Moon className="w-5 h-5 fill-current" />
                        </div>
                        Sleep Guide
                    </h2>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sidebar (Desktop) / Top Nav (Mobile) */}
                <div className="w-full md:w-72 bg-slate-50/50 md:border-r border-b md:border-b-0 border-slate-200 p-4 md:p-6 flex flex-col shrink-0 overflow-x-auto md:overflow-y-auto no-scrollbar backdrop-blur-md">
                    <div className="hidden md:flex items-center gap-3 mb-8 px-2">
                        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30">
                            <Moon className="w-7 h-7 fill-white/20 stroke-[2.5]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Sleep Guide</h2>
                            <p className="text-xs text-slate-500 font-medium">Better Rest, Better Life</p>
                        </div>
                    </div>

                    <nav className="flex md:flex-col gap-2 md:gap-3 flex-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-none md:w-full group flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${activeTab === tab.id
                                    ? "bg-white text-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] ring-1 ring-slate-200 scale-100"
                                    : "text-slate-500 hover:bg-white/60 hover:text-slate-700 hover:scale-[1.02]"
                                    }`}
                            >
                                <div className={`p-2 rounded-xl transition-colors ${activeTab === tab.id ? tab.bg + " " + tab.color : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-600"}`}>
                                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "animate-pulse" : ""}`} />
                                </div>
                                <span className="whitespace-nowrap">{tab.label}</span>
                                {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto text-slate-300 hidden md:block" />}
                            </button>
                        ))}
                    </nav>

                    {/* Quote Card (Desktop Only) */}
                    <div className="hidden md:block mt-auto pt-6">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
                            <Quote className="absolute top-4 right-4 text-white/10 w-12 h-12 rotate-180" />
                            <p className="relative z-10 text-sm font-medium leading-relaxed opacity-90 mb-3">
                                "Sleep is the golden chain that ties health and our bodies together."
                            </p>
                            <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">— Thomas Dekker</p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col relative bg-white overflow-hidden">
                    <button
                        onClick={onClose}
                        className="hidden md:flex absolute top-5 right-5 p-2 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all z-[110] border border-slate-200 shadow-sm"
                        title="Close Guide"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar scroll-smooth">

                        {/* HYGIENE TAB */}
                        {activeTab === "hygiene" && (
                            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                                <div className="relative h-56 md:h-64 rounded-[2rem] overflow-hidden group shadow-lg shadow-indigo-900/10">
                                    <div className="absolute inset-0 bg-indigo-900/40 group-hover:bg-indigo-900/30 transition-colors z-10" />
                                    <img
                                        src="https://images.unsplash.com/photo-1520206183501-b80df61043c2?q=80&w=2071&auto=format&fit=crop"
                                        alt="Sleep Hygiene"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-8 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">Master Your Sleep</h3>
                                        <p className="text-indigo-100 text-sm md:text-base max-w-lg font-medium">Small habits that make a massive difference in your sleep quality.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {[
                                        {
                                            title: "Cool & Dark Room",
                                            desc: "Keep your bedroom cool (around 18-20°C) and completely dark. Uses blackout curtains if needed.",
                                            icon: Moon, color: "text-indigo-600", bg: "bg-indigo-50"
                                        },
                                        {
                                            title: "Consistent Schedule",
                                            desc: "Go to bed and wake up at the same time every day to regulate your internal clock.",
                                            icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50"
                                        },
                                        {
                                            title: "Limit Caffeine",
                                            desc: "Avoid caffeine and large meals at least 3-4 hours before bedtime.",
                                            icon: Battery, color: "text-amber-600", bg: "bg-amber-50"
                                        },
                                        {
                                            title: "Morning Sunlight",
                                            desc: "Get natural sunlight within 30 mins of waking to reset your circadian rhythm.",
                                            icon: Sun, color: "text-orange-600", bg: "bg-orange-50"
                                        }
                                    ].map((tip, i) => (
                                        <div key={i} className="group relative bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                            <div className="flex gap-5">
                                                <div className={`shrink-0 w-14 h-14 rounded-2xl ${tip.bg} ${tip.color} flex items-center justify-center shadow-inner`}>
                                                    <tip.icon className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-lg mb-1">{tip.title}</h4>
                                                    <p className="text-sm text-slate-500 leading-relaxed">{tip.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* IDEAL HOURS TAB */}
                        {activeTab === "hours" && (
                            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                                <div className="relative rounded-[2.5rem] bg-emerald-900/5 p-8 md:p-12 overflow-hidden text-center">
                                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
                                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
                                    <h3 className="relative z-10 text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">How Much Sleep<br /><span className="text-emerald-600">Do You Really Need?</span></h3>
                                    <p className="relative z-10 text-slate-500 text-lg max-w-xl mx-auto font-medium">It changes as you grow. Find your recommended range below.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    {[
                                        { age: "Newborns", range: "0-3 mos", hours: "14-17 hrs", color: "bg-blue-50 text-blue-700 border-blue-100" },
                                        { age: "Infants", range: "4-11 mos", hours: "12-15 hrs", color: "bg-cyan-50 text-cyan-700 border-cyan-100" },
                                        { age: "Toddlers", range: "1-2 yrs", hours: "11-14 hrs", color: "bg-teal-50 text-teal-700 border-teal-100" },
                                        { age: "Preschool", range: "3-5 yrs", hours: "10-13 hrs", color: "bg-green-50 text-green-700 border-green-100" },
                                        { age: "School Age", range: "6-13 yrs", hours: "9-11 hrs", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                                        { age: "Teenagers", range: "14-17 yrs", hours: "8-10 hrs", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
                                        { age: "Adults", range: "18-64 yrs", hours: "7-9 hrs", color: "bg-violet-50 text-violet-700 border-violet-100" },
                                        { age: "Older Adults", range: "65+ yrs", hours: "7-8 hrs", color: "bg-purple-50 text-purple-700 border-purple-100" },
                                    ].map((item, i) => (
                                        <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border ${item.color} transition-transform hover:scale-[1.02] cursor-default bg-white/50 hover:bg-white`}>
                                            <div>
                                                <div className="font-bold text-lg">{item.age}</div>
                                                <div className="text-xs font-bold opacity-60 uppercase tracking-wider">{item.range}</div>
                                            </div>
                                            <div className="px-4 py-2 bg-white rounded-xl shadow-sm text-sm font-black tracking-wide ring-1 ring-slate-100">
                                                {item.hours}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SLEEP CYCLE TAB */}
                        {activeTab === "cycle" && (
                            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                                <div className="relative h-64 rounded-[2rem] overflow-hidden group shadow-lg shadow-violet-900/10 flex items-end p-8">
                                    <img
                                        src="https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?q=80&w=2099&auto=format&fit=crop"
                                        alt="Sleep Cycle"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-violet-950/90 via-violet-900/40 to-transparent" />
                                    <div className="relative z-10 text-white">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                                            <Brain className="w-3 h-3" /> Science of Sleep
                                        </div>
                                        <h3 className="text-3xl md:text-5xl font-bold mb-2">The Sleep Cycle</h3>
                                        <p className="text-violet-200">A typical night consists of 4-6 sleep cycles, each lasting ~90 minutes.</p>
                                    </div>
                                </div>

                                <div className="relative px-4 md:px-8">
                                    <div className="absolute left-8 md:left-12 top-4 bottom-4 w-0.5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200"></div>

                                    <div className="space-y-10 relative z-10">
                                        {[
                                            {
                                                stage: "Stage 1 (NREM)",
                                                duration: "1-5 mins",
                                                desc: "Light sleep. You drift in and out of sleep and can be awakened easily. Muscle activity slows.",
                                                color: "bg-sky-500", shadow: "shadow-sky-500/30"
                                            },
                                            {
                                                stage: "Stage 2 (NREM)",
                                                duration: "10-60 mins",
                                                desc: "Body temperature drops, heart rate slows. Brain begins to produce sleep spindles. You spend ~50% of sleep here.",
                                                color: "bg-blue-500", shadow: "shadow-blue-500/30"
                                            },
                                            {
                                                stage: "Stage 3 (Deep Sleep)",
                                                duration: "20-40 mins",
                                                desc: "Deep slow-wave sleep. Crucial for physical restoration, immune function, and energy. Hard to wake up.",
                                                color: "bg-indigo-600", shadow: "shadow-indigo-500/30"
                                            },
                                            {
                                                stage: "REM Sleep",
                                                duration: "10-60 mins",
                                                desc: "Rapid Eye Movement. Brain activity increases, dreams occur. Essential for memory, learning, and mood.",
                                                color: "bg-violet-600", shadow: "shadow-violet-500/30"
                                            }
                                        ].map((phase, i) => (
                                            <div key={i} className="flex gap-6 md:gap-8 items-start group">
                                                <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full ${phase.color} border-4 border-white shadow-lg ${phase.shadow} flex items-center justify-center text-white font-bold text-sm md:text-base relative z-10 group-hover:scale-110 transition-transform`}>
                                                    {i + 1}
                                                </div>
                                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex-1 hover:shadow-lg hover:border-violet-100 transition-all duration-300 -mt-2">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                                                        <h4 className="font-bold text-lg text-slate-900">{phase.stage}</h4>
                                                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">{phase.duration}</span>
                                                    </div>
                                                    <p className="text-slate-600 text-sm leading-relaxed">{phase.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MYTHS TAB */}
                        {activeTab === "myths" && (
                            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                                <header className="text-center mb-10 py-10 bg-rose-50/50 rounded-[2.5rem] border border-rose-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                    <Smartphone className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-bounce" />
                                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                                        Phone & Sleep Myths
                                    </h3>
                                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Separating fact from fiction about blue light and screens.</p>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        {
                                            myth: "Night mode makes it okay to use your phone.",
                                            fact: "False. While 'Night Shift' reduces blue light, the mental stimulation from content (social media, emails) still keeps your brain alert.",
                                            status: "BUSTED"
                                        },
                                        {
                                            myth: "Watching TV helps me fall asleep.",
                                            fact: "False. It might help you doze off, but it negatively impacts sleep quality and disrupts deep sleep phases.",
                                            status: "BUSTED"
                                        },
                                        {
                                            myth: "Checking the time helps anxiety.",
                                            fact: "False. 'Clock-watching' actually increases stress and cortisol, making it harder to fall back asleep.",
                                            status: "BUSTED"
                                        },
                                        {
                                            myth: "I can catch up on sleep on weekends.",
                                            fact: "False. You can't fully recover 'sleep debt'. Inconsistent schedules creates 'social jetlag' which harms long-term health.",
                                            status: "BUSTED"
                                        }
                                    ].map((item, i) => (
                                        <div key={i} className="group bg-white border border-rose-100 p-6 rounded-[2rem] relative overflow-hidden hover:shadow-xl hover:shadow-rose-900/5 transition-all duration-300 hover:-translate-y-1">
                                            <div className="absolute top-0 right-0 px-4 py-1.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl shadow-lg shadow-rose-500/20">
                                                {item.status}
                                            </div>
                                            <h4 className="font-bold text-lg text-rose-950 mb-4 pr-16 bg-rose-50/50 p-3 rounded-2xl w-fit -ml-2 pl-3">{item.myth}</h4>
                                            <div className="flex gap-4">
                                                <div className="shrink-0 p-2 bg-rose-50 text-rose-500 rounded-xl h-fit">
                                                    <AlertTriangle className="w-5 h-5" />
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed font-medium pt-1">
                                                    {item.fact}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
        , document.body);
}
