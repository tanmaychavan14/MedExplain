import { Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full py-8 border-t border-[var(--color-surface-200)] bg-white/80 backdrop-blur-md mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
                    @2026 MedExplain. Built by
                </p>
                <p className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-medium text-[var(--color-text-tertiary)]">
                    <span></span>
                    <span className="font-bold text-[var(--color-text-primary)]">Blind Coders</span>
                    <span>with</span>
                    <Heart className="w-3.5 h-3.5 text-[var(--color-error)] fill-[var(--color-error)] animate-pulse" />
                </p>
            </div>
        </footer>
    );
}
