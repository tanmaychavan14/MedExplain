import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Activity, ArrowRight, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

const COLORS = {
    Normal: '#10b981', // emerald-500
    High: '#f59e0b',   // amber-500
    Low: '#ef4444',    // red-500
    Positive: '#10b981',
    Warning: '#f59e0b',
    Negative: '#ef4444',
    Neutral: '#64748b'
};

const RangeBar = ({ label, value, unit, min, max, status }) => {
    // Calculate percentage position
    // Default range spread: if min/max exist, span = max - min + padding
    // If no min/max, just show value

    if (min == null || max == null) {
        return (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="font-medium text-slate-700">{label}</span>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">{value}</span>
                    <span className="text-xs text-slate-500">{unit}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${status === 'Normal' ? 'bg-emerald-100 text-emerald-700' :
                        status === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {status}
                    </span>
                </div>
            </div>
        );
    }

    // Normalize for visualization
    const range = max - min;
    const padding = range * 0.5; // Add visual padding
    const plotMin = Math.max(0, min - padding);
    const plotMax = max + padding;
    const totalSpan = plotMax - plotMin;

    const valuePercent = Math.min(100, Math.max(0, ((value - plotMin) / totalSpan) * 100));
    const minPercent = ((min - plotMin) / totalSpan) * 100;
    const maxPercent = ((max - plotMin) / totalSpan) * 100;

    return (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <p className="text-sm font-medium text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400">Normal: {min} - {max} {unit}</p>
                </div>
                <div className="text-right">
                    <span className={`text-lg font-bold ${status === 'Normal' ? 'text-emerald-600' :
                        status === 'High' ? 'text-amber-600' : 'text-blue-600'
                        }`}>
                        {value}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">{unit}</span>
                </div>
            </div>

            {/* Range Bar Container */}
            <div className="relative h-4 bg-slate-200 rounded-full w-full mt-2 overflow-hidden">
                {/* Normal Range Zone */}
                <div
                    className="absolute h-full bg-emerald-200/50"
                    style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                />

                {/* Value Marker */}
                <div
                    className={`absolute top-0 bottom-0 w-1.5 rounded-full shadow-sm transition-all duration-1000 ${status === 'Normal' ? 'bg-emerald-500' :
                        status === 'High' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                    style={{ left: `${valuePercent}%`, transform: 'translateX(-50%)' }}
                />
            </div>

            {/* Axis Labels */}
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>{plotMin.toFixed(0)}</span>
                <span>{plotMax.toFixed(0)}</span>
            </div>
        </div>
    );
};

export default function ReportCharts({ visualizations }) {
    if (!visualizations || visualizations.length === 0) return null;

    // Prepare data for Overview Pie Chart
    const statusCounts = visualizations.reduce((acc, curr) => {
        const s = curr.status || 'Normal';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.keys(statusCounts).map(key => ({
        name: key,
        value: statusCounts[key]
    }));

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">

            {/* Header */}
            <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-800">Visual Analysis</h3>
            </div>

            {/* Grid Layout: Stacked for better visibility in split-view */}
            <div className="flex flex-col gap-6">

                {/* Overview Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                    <div className="flex items-center justify-between w-full mb-4">
                        <h4 className="text-sm font-semibold text-slate-600">Overview</h4>
                        <div className="text-xs text-slate-400">Total: {visualizations.length} metrics</div>
                    </div>

                    <div className="w-full h-[220px] max-w-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.Neutral} stroke="none" />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ paddingTop: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Range Bars */}
                <div className="w-full space-y-3">
                    {visualizations.map((metric, idx) => (
                        <RangeBar
                            key={idx}
                            label={metric.label}
                            value={metric.value}
                            unit={metric.unit}
                            min={metric.min_range}
                            max={metric.max_range}
                            status={metric.status}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
