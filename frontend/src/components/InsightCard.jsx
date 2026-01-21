import { AlertTriangle, CheckCircle2, Info, Activity } from "lucide-react";

export default function InsightCard({ category, insight, status = "neutral", emoji }) {
    const styles = {
        positive: {
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            text: "text-emerald-900",
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        },
        warning: {
            bg: "bg-amber-50",
            border: "border-amber-100",
            text: "text-amber-900",
            icon: <AlertTriangle className="w-5 h-5 text-amber-600" />
        },
        negative: {
            bg: "bg-red-50",
            border: "border-red-100",
            text: "text-red-900",
            icon: <AlertTriangle className="w-5 h-5 text-red-600" />
        },
        neutral: {
            bg: "bg-slate-50",
            border: "border-slate-100",
            text: "text-slate-800",
            icon: <Info className="w-5 h-5 text-teal-600" />
        }
    };

    const theme = styles[status] || styles.neutral;

    return (
        <div className={`${theme.bg} ${theme.border} border rounded-xl p-5 transition-all hover:shadow-sm`}>
            <div className="flex items-start gap-4">
                <div className="text-2xl pt-1 select-none">
                    {emoji || <Activity className="w-6 h-6 text-slate-400" />}
                </div>
                <div>
                    <h4 className={`font-bold ${theme.text} mb-1 text-sm uppercase tracking-wide opacity-80`}>
                        {category}
                    </h4>
                    <p className="font-semibold text-slate-800 leading-snug">
                        {insight}
                    </p>
                </div>
            </div>
        </div>
    );
}
