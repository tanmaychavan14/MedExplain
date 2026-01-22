import { useState } from 'react';
import { Activity, Heart, Brain, Search, Info, Zap, Wind, Droplets, Utensils, Stethoscope } from 'lucide-react';

export default function BodyGuide() {
    const [activePart, setActivePart] = useState("heart"); // Default to heart so it's not empty

    const organData = {
        brain: {
            id: "brain",
            icon: Brain,
            title: "Brain & Nervous System",
            tests: ["Vitamin B12", "Electrolytes", "MRI/CT Scan"],
            description: "Controls thought, memory, emotion, touch, motor skills, vision, breathing, temperature, hunger and every process that regulates our body.",
            tips: ["Sleep 7-8 hours", "Stay mentally active", "Monitor blood pressure"]
        },
        thyroid: {
            id: "thyroid",
            icon: Zap,
            title: "Thyroid Gland",
            tests: ["TSH", "T3 & T4", "Thyroid Antibodies"],
            description: "Regulates metabolism, energy generation, and mood. A butterfly-shaped gland in your neck.",
            tips: ["Iodine-rich foods", "Regular screening", "Stress management"]
        },
        heart: {
            id: "heart",
            icon: Heart,
            title: "Heart Health",
            tests: ["Lipid Profile", "Troponin", "ECG/ECHO", "CRP"],
            description: "Pumps blood throughout your body. Key indicators include cholesterol levels and blood pressure.",
            tips: ["30 mins daily cardio", "Reduce sodium intake", "Manage stress"]
        },
        lungs: {
            id: "lungs",
            icon: Wind,
            title: "Respiratory Health",
            tests: ["Spirometry", "Chest X-Ray", "Blood Gases"],
            description: "Responsible for oxygen exchange. Vital for energy and removing carbon dioxide.",
            tips: ["Avoid smoking", "Breathing exercises", "Avoid pollutants"]
        },
        liver: {
            id: "liver",
            icon: Activity,
            title: "Liver Function",
            tests: ["LFT (SGOT/SGPT)", "Bilirubin", "Albumin"],
            description: "Detoxifies chemicals and metabolizes drugs. Also makes proteins important for blood clotting.",
            tips: ["Limit alcohol", "Maintain healthy weight", "Stay hydrated"]
        },
        stomach: {
            id: "stomach",
            icon: Utensils,
            title: "Digestive System",
            tests: ["Stool Test", "Endoscopy", "H. Pylori"],
            description: "Breaks down food to extract nutrients essential for the body.",
            tips: ["High fiber diet", "Eat slowly", "Probiotics"]
        },
        kidneys: {
            id: "kidneys",
            icon: Droplets,
            title: "Kidney Health",
            tests: ["KFT (Creatinine)", "eGFR", "Urine Routine"],
            description: "Filters waste and extra water from your blood to make urine.",
            tips: ["Drink plenty of water", "Control blood sugar", "Monitor BP"]
        }
    };

    const activeData = organData[activePart];
    const ActiveIcon = activeData.icon;

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">

            {/* Left Column: Organ Selection Grid */}
            <div className="w-full lg:w-1/3">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Stethoscope className="w-5 h-5 text-teal-600" />
                            Select a System
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Explore medical insights by organ</p>
                    </div>

                    <div className="p-4 grid grid-cols-1 gap-3 overflow-y-auto custom-scrollbar flex-1">
                        {Object.values(organData).map((organ) => {
                            const Icon = organ.icon;
                            const isActive = activePart === organ.id;

                            return (
                                <button
                                    key={organ.id}
                                    onClick={() => setActivePart(organ.id)}
                                    className={`
                    w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border text-left group
                    ${isActive
                                            ? "bg-teal-50 border-teal-200 shadow-sm"
                                            : "bg-white border-slate-100 hover:border-teal-100 hover:bg-slate-50"}
                  `}
                                >
                                    <div className={`
                    p-3 rounded-full shrink-0 transition-colors
                    ${isActive ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-400 group-hover:text-teal-500 group-hover:bg-teal-50"}
                  `}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold transition-colors ${isActive ? "text-teal-900" : "text-slate-700 group-hover:text-slate-900"}`}>
                                            {organ.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-0.5 font-medium">View Tests & Tips</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right Column: Detail View */}
            <div className="w-full lg:w-2/3">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-hidden flex flex-col relative">

                    {/* Header Graphic */}
                    <div className="h-32 bg-gradient-to-r from-teal-600 to-emerald-500 relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-10"></div>
                        <div className="absolute -bottom-10 -right-10 text-white/10">
                            <ActiveIcon className="w-64 h-64" />
                        </div>

                        <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/20 uppercase tracking-wider">
                                    Medical Guide
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">{activeData.title}</h2>
                        </div>
                    </div>

                    <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                        {/* Description */}
                        <div className="prose prose-slate max-w-none">
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                {activeData.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Lab Tests Card */}
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-full hover:border-teal-200 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Critical Lab Tests</h3>
                                </div>

                                <ul className="space-y-3">
                                    {activeData.tests.map((test, i) => (
                                        <li key={i} className="flex items-start gap-3 group/item">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 group-hover/item:scale-125 transition-transform" />
                                            <span className="text-slate-600 font-medium group-hover/item:text-slate-900 transition-colors">
                                                {test}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Health Tips Card */}
                            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 h-full hover:border-emerald-200 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                        <Info className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-emerald-900">Physician's Tips</h3>
                                </div>

                                <ul className="space-y-3">
                                    {activeData.tips.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                                                {i + 1}
                                            </div>
                                            <span className="text-emerald-800 font-medium">
                                                {tip}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Medical Disclaimer */}
                    <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800 leading-relaxed">
                            <strong>Disclaimer:</strong> This guide is for educational purposes only and does not constitute medical advice.
                            Lab tests and health indicators vary by individual. Always consult a qualified healthcare provider for diagnosis and treatment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
