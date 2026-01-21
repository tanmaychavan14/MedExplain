import { useState } from "react";
import { Heart, X, Github, Linkedin } from "lucide-react";

export default function Footer() {
    const [showTeam, setShowTeam] = useState(false);

    const developers = [
        {
            name: "Joshua Vinu Koshy",
            image: "/team/joshua.png",
            role: "Developer"
        },
        {
            name: "Tanmay Santosh Chavan",
            image: "/team/tanmay.jpg",
            role: "Developer"
        },
        {
            name: "Arrpita Merlin Abbey",
            image: "/team/arrpita.jpg",
            role: "Developer"
        }
    ];

    return (
        <>
            <footer className="w-full py-8 border-t border-[var(--color-surface-200)] bg-white/80 backdrop-blur-md mt-auto">
                <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-3 text-center">
                    <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
                        @2026 MedExplain.
                    </p>
                    <p className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-medium text-[var(--color-text-tertiary)]">
                        <span>Built by</span>
                        <button
                            onClick={() => setShowTeam(true)}
                            className="font-bold text-teal-600 hover:text-teal-700 hover:underline decoration-2 underline-offset-2 transition-all cursor-pointer"
                        >
                            Blind Coders
                        </button>
                        <span>with</span>
                        <Heart className="w-3.5 h-3.5 text-[var(--color-error)] fill-[var(--color-error)] animate-pulse" />
                    </p>
                </div>
            </footer>

            {/* Team Modal */}
            {showTeam && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowTeam(false)}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full mx-auto animate-in fade-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setShowTeam(false)}
                            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Meet the Builders</h2>
                            <p className="text-slate-500">The minds behind MedExplain</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {developers.map((dev, index) => (
                                <div key={index} className="flex flex-col items-center group">
                                    <div className="relative mb-4">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-slate-100 group-hover:ring-teal-500/50 transition-all duration-300 group-hover:scale-105">
                                            <img
                                                src={dev.image}
                                                alt={dev.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            <Heart className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800 mb-1">{dev.name}</h3>
                                    <span className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider rounded-full">
                                        {dev.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
