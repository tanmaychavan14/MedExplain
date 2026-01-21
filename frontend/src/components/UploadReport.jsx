import { useState, useEffect, useRef } from "react";
import { uploadReport, explainMedicalTerm, checkSymptoms, identifyMedicine } from "../services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FileText,
  UploadCloud,
  Search,
  Activity,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Loader,
  BookOpen,
  Stethoscope,
  Quote,
  Star,
  Sparkles,
  BrainCircuit,
  ShieldCheck,
  Languages,
  MessageCircle,
  Phone,
  Pill,
  Zap
} from "lucide-react";

// Animated Counter Component
// Animated Counter Component with Intersection Observer
function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useState(null); // Ref for the element

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = document.getElementById(`counter-${end}`);
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [end, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const ease = (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));

      setCount(Math.floor(end * ease(percentage)));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration]);

  return <span id={`counter-${end}`}>{count}</span>;
}

// Testimonials Data
const testimonials = [
  {
    text: "MedExplain helped me understand my blood test results before meeting my doctor. It made the conversation so much easier!",
    author: "Priya Sharma",
    role: "Patient, Mumbai",
    avatar: "PS"
  },
  {
    text: "The symptom checker gave me peace of mind and helped me decide when to see a doctor. Very helpful tool!",
    author: "Rajesh Kumar",
    role: "Parent, Pune",
    avatar: "RK"
  },
  {
    text: "Finally, a tool that explains medical jargon in simple Hindi. It's been a blessing for my elderly parents.",
    author: "Anita Desai",
    role: "Caregiver, Delhi",
    avatar: "AD"
  }
];

export default function UploadReport({ user, onResult, onUploadSuccess, summary }) {
  // Upload Section State
  const [file, setFile] = useState(null);
  const [reportType, setReportType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en");

  // Medical Terms Section State
  const [medicalTerm, setMedicalTerm] = useState("");
  const [termDefinition, setTermDefinition] = useState("");
  const [termLoading, setTermLoading] = useState(false);

  // Symptom Checker Section State
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [symptomLoading, setSymptomLoading] = useState(false);
  const isSummaryActive = Boolean(summary);

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Medicine Decoder state
  const [medicineName, setMedicineName] = useState("");
  const [medicineInfo, setMedicineInfo] = useState(null);
  const [medicineLoading, setMedicineLoading] = useState(false);
  const [medicineError, setMedicineError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleIdentifyMedicine() {
    if (!medicineName.trim()) return;
    setMedicineLoading(true);
    setMedicineInfo(null);
    setMedicineError(null);
    try {
      const resultJson = await identifyMedicine(medicineName, language, user);
      // Clean and parse JSON
      let cleanJson = resultJson;
      if (typeof cleanJson === 'object') {
        // If already an object (axios/fetch sometimes parses), use it
        setMedicineInfo(cleanJson);
      } else if (typeof cleanJson === 'string') {
        if (cleanJson.startsWith("```json")) cleanJson = cleanJson.slice(7);
        if (cleanJson.startsWith("```")) cleanJson = cleanJson.slice(3);
        if (cleanJson.endsWith("```")) cleanJson = cleanJson.slice(0, -3);
        try {
          setMedicineInfo(JSON.parse(cleanJson));
        } catch (e) {
          console.error("JSON parse error", e);
          setMedicineInfo({ purpose: "Could not parse info", best_time: "-", side_effects: "-" });
        }
      }
    } catch (err) {
      console.error(err);
      setMedicineError(err.message || "Failed to identify. Please try again.");
    } finally {
      setMedicineLoading(false);
    }
  }

  async function handleUpload() {
    if (!file || !user) {
      setError("User not logged in or file missing");
      return;
    }

    if (!reportType) {
      setError("Please select a report type");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await uploadReport(file, reportType, language, user);
      onResult({
        summary: result.summary,
        reportName: file.name.replace(/\.[^/.]+$/, "").toLowerCase(),
        reportType: reportType
      });

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMedicalTermSearch() {
    if (!medicalTerm.trim()) return;

    setTermLoading(true);
    setTermDefinition("");

    try {
      const { explainMedicalTerm } = await import("../services/api");
      const result = await explainMedicalTerm(medicalTerm, language, user);
      setTermDefinition(result.explanation);
    } catch (err) {
      setTermDefinition("Failed to get explanation. Please try again.");
      console.error(err);
    } finally {
      setTermLoading(false);
    }
  }

  async function handleSymptomCheck() {
    if (!symptoms.trim()) return;

    setSymptomLoading(true);
    setDiagnosis("");

    try {
      const { checkSymptoms } = await import("../services/api");
      const result = await checkSymptoms(symptoms, language, user);
      setDiagnosis(result.analysis);
    } catch (err) {
      setDiagnosis("Failed to analyze symptoms. Please try again.");
      console.error(err);
    } finally {
      setSymptomLoading(false);
    }
  }


  return (
    <div className={`grid gap-8 w-full ${!isSummaryActive ? 'lg:grid-cols-12' : 'grid-cols-1'} animate-in fade-in duration-500`}>

      {/* LEFT COLUMN (Upload & Tools) - Spans 8 cols */}
      <div className={`${!isSummaryActive ? 'lg:col-span-8' : 'w-full'} space-y-8`}>
        {/* 1. UPLOAD REPORT SECTION */}
        {/* 1. UPLOAD REPORT SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative group transition-colors duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-cyan-600"></div>
          <div className="p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-teal-600" />
                  Upload Medical Report
                </h2>
                <p className="text-slate-500 mt-2 text-lg">
                  Understand your medical report in seconds.
                </p>
              </div>
              <div className="hidden sm:block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider rounded-full">
                Smart Analysis
              </div>
            </div>

            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Enhanced Drop Zone */}
              <div className="relative">
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  onChange={e => {
                    setFile(e.target.files[0]);
                    setError(null);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`
                  border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 transform
                  flex flex-col items-center gap-4 bg-gradient-to-b from-slate-50/50 to-white
                  ${file
                    ? "border-teal-500 bg-teal-50/50 ring-4 ring-teal-500/10 scale-[1.01]"
                    : "border-slate-300 hover:border-teal-400 hover:bg-teal-50/30 hover:scale-[1.01]"}
                `}>
                  <div className={`
                    p-5 rounded-full shadow-sm transition-all duration-300
                    ${file
                      ? "bg-teal-100 text-teal-600"
                      : "bg-white text-slate-400 group-hover:text-teal-500 group-hover:shadow-md"}
                  `}>
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-700">
                      {file ? file.name : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {file ? "Ready to upload" : "PDF files only (Max 10MB)"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Report Type</label>
                  <div className="relative">
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full p-3 pl-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all appearance-none cursor-pointer hover:border-teal-300"
                    >
                      <option value="">Select type...</option>
                      <option value="CBC">🩸 Complete Blood Count</option>
                      <option value="LIPID">💧 Lipid Profile</option>
                      <option value="LFT">🫀 Liver Function Test</option>
                      <option value="KFT">🫘 Kidney Function Test</option>
                      <option value="THYROID">🦋 Thyroid Function</option>
                      <option value="DIABETES">🍬 Diabetes Panel</option>
                      <option value="OTHER">📋 Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Language</label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full p-3 pl-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all appearance-none cursor-pointer hover:border-teal-300"
                    >
                      <option value="en">🇬🇧 English</option>
                      <option value="hi">🇮🇳 Hindi</option>
                      <option value="mr">🇮🇳 Marathi</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={loading || !file || !reportType}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-teal-600/20 hover:from-teal-500 hover:to-cyan-500 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Analyzing Report...
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    Generate Summary
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 2. TOOLS GRID (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Medical Terms */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">Medical Dictionary</h3>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search (e.g. Hemoglobin)"
                    value={medicalTerm}
                    onChange={(e) => setMedicalTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleMedicalTermSearch()}
                    className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                  <button
                    onClick={handleMedicalTermSearch}
                    disabled={termLoading || !medicalTerm.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-emerald-600 disabled:opacity-50 transition-colors"
                  >
                    {termLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>
                {termDefinition ? (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-sm animate-in fade-in zoom-in-95">
                    <p className="font-semibold text-emerald-800 mb-1">{medicalTerm}:</p>
                    <div className="prose prose-sm prose-emerald max-w-none text-slate-700">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{termDefinition}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mt-2">
                    Instantly understand complex medical terms found in your reports.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card: Symptom Checker */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">Symptom Checker</h3>
              </div>
              <div className="space-y-4">
                <textarea
                  placeholder="Describe symptoms..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-sm min-h-[50px] resize-none"
                  rows="2"
                />
                <button
                  onClick={handleSymptomCheck}
                  disabled={symptomLoading || !symptoms.trim()}
                  className="w-full py-2.5 px-4 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {symptomLoading ? "Checking..." : "Analyze Symptoms"}
                </button>
                {diagnosis && (
                  <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm animate-in fade-in zoom-in-95 shadow-sm mt-auto">
                    <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-500" />
                      Possible Causes:
                    </p>
                    <div className="prose prose-sm max-w-none text-slate-600 line-clamp-4 hover:line-clamp-none transition-all">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{diagnosis}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card: Medicine Decoder - Spans 2 Cols */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow overflow-hidden md:col-span-2">
            <div className="p-5 border-b border-slate-100 bg-teal-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm text-teal-600">
                  <Pill className="w-5 h-5" />
                </div>
                Medicine Decoder
              </h3>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex gap-4 items-start flex-col md:flex-row">
                <div className="w-full md:w-auto md:flex-1">
                  <input
                    type="text"
                    placeholder="Enter medicine name (e.g., 'Dolo 650')"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-slate-400 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleIdentifyMedicine()}
                  />
                  {medicineError && (
                    <p className="text-xs text-red-500 mt-2 font-medium">{medicineError}</p>
                  )}
                </div>
                <button
                  onClick={handleIdentifyMedicine}
                  disabled={medicineLoading || !medicineName.trim()}
                  className="w-full md:w-auto py-3 px-6 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-500 transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {medicineLoading ? "Decoding..." : "Identify Medicine"}
                </button>
              </div>

              {medicineInfo && (
                <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                  {medicineInfo.name_confirmed && (
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide border-b border-slate-200 pb-2 mb-2">
                      {medicineInfo.name_confirmed}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                    <div>
                      <span className="block font-semibold text-slate-700 mb-1">Purpose</span>
                      <span className="text-slate-600 block bg-white p-2 rounded-lg border border-slate-200">{medicineInfo.purpose}</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-700 mb-1">Best Time</span>
                      <span className="text-slate-600 block bg-white p-2 rounded-lg border border-slate-200">{medicineInfo.best_time}</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-700 mb-1">Caution</span>
                      <span className="text-slate-600 block bg-white p-2 rounded-lg border border-slate-200">{medicineInfo.side_effects}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4">
                <div className="text-xs text-slate-400 flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-500" />
                  <p className="leading-relaxed">Consult your doctor before taking any medication. This tool is for informational purposes only.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>


      {/* RIGHT COLUMN (Stats, Features, Testimonials) - Spans 4 cols */}
      {
        !isSummaryActive && (
          <div className="lg:col-span-4 space-y-6 flex flex-col h-full">

            {/* 1. Stats Grid - NOW AT TOP for Clarity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 flex items-baseline gap-0.5">
                  <AnimatedCounter end={10} duration={2000} />
                  <span>k+</span>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1 group-hover:text-blue-500 transition-colors">Reports</div>
              </div>
              <div className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 flex items-baseline gap-0.5">
                  <AnimatedCounter end={98} duration={2000} />
                  <span>%</span>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1 group-hover:text-emerald-500 transition-colors">Happy Users</div>
              </div>
            </div>

            {/* 2. Why Choose MedExplain - Features (Premium Enhanced) */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden ring-1 ring-slate-900/5 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group/card relative">

              {/* Decorative Gradient Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 opacity-80"></div>

              <div className="p-6 border-b border-slate-100/60 bg-white/40 relative">
                <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600 drop-shadow-sm tracking-tight">
                    Why MedExplain?
                  </span>
                </h3>
              </div>

              <div className="divide-y divide-slate-100/60">
                {[
                  {
                    title: "Instant Clarity",
                    desc: "Understand complex reports in seconds.",
                    icon: Zap,
                    color: "text-amber-500",
                    bg: "bg-amber-50",
                    border: "group-hover:border-amber-400/50",
                    shadow: "shadow-amber-500/20"
                  },
                  {
                    title: "100% Private",
                    desc: "Your health data never leaves your device.",
                    icon: ShieldCheck,
                    color: "text-emerald-500",
                    bg: "bg-emerald-50",
                    border: "group-hover:border-emerald-400/50",
                    shadow: "shadow-emerald-500/20"
                  },
                  {
                    title: "Smart Insights",
                    desc: "AI-powered analysis you can trust.",
                    icon: BrainCircuit,
                    color: "text-indigo-500",
                    bg: "bg-indigo-50",
                    border: "group-hover:border-indigo-400/50",
                    shadow: "shadow-indigo-500/20"
                  }
                ].map((item, i) => (
                  <div key={i}
                    className={`group p-5 flex items-center gap-4 hover:bg-white/90 transition-all duration-500 ease-out cursor-default border-l-[3px] border-transparent ${item.border} relative overflow-hidden`}
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shadow-lg ${item.shadow} group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 ring-4 ring-white relative z-10`}>
                      <item.icon className="w-6 h-6 group-hover:animate-pulse" />
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-teal-700 transition-colors duration-300">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed group-hover:text-slate-600 transition-colors duration-300">{item.desc}</p>
                    </div>
                    {/* Subtle Background Glow on Hover */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transform`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Quick BMI Calculator (Functional Widget) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-slate-100 bg-teal-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" />
                  Quick BMI Check
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weight (kg)</label>
                    <input
                      type="number"
                      placeholder="e.g. 70"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-sm font-medium"
                      onChange={(e) => {
                        const w = parseFloat(e.target.value);
                        const h = parseFloat(document.getElementById('bmi-height').value);
                        const resultEl = document.getElementById('bmi-result');
                        if (w && h) {
                          const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
                          let category = "";
                          let color = "";
                          if (bmi < 18.5) { category = "Underweight"; color = "text-blue-500"; }
                          else if (bmi < 25) { category = "Normal"; color = "text-emerald-500"; }
                          else if (bmi < 30) { category = "Overweight"; color = "text-orange-500"; }
                          else { category = "Obese"; color = "text-red-500"; }

                          resultEl.innerHTML = `
                            <div class="text-3xl font-bold ${color}">${bmi}</div>
                            <div class="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">${category}</div>
                          `;
                        } else {
                          resultEl.innerHTML = '<div class="text-sm text-slate-400">Enter details</div>';
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Height (cm)</label>
                    <input
                      id="bmi-height"
                      type="number"
                      placeholder="e.g. 175"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-sm font-medium"
                      onChange={(e) => {
                        const h = parseFloat(e.target.value);
                        const w = parseFloat(document.querySelector('input[placeholder="e.g. 70"]').value);
                        const resultEl = document.getElementById('bmi-result');
                        if (w && h) {
                          const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
                          let category = "";
                          let color = "";
                          if (bmi < 18.5) { category = "Underweight"; color = "text-blue-500"; }
                          else if (bmi < 25) { category = "Normal"; color = "text-emerald-500"; }
                          else if (bmi < 30) { category = "Overweight"; color = "text-orange-500"; }
                          else { category = "Obese"; color = "text-red-500"; }

                          resultEl.innerHTML = `
                            <div class="text-3xl font-bold ${color}">${bmi}</div>
                            <div class="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">${category}</div>
                          `;
                        } else {
                          resultEl.innerHTML = '<div class="text-sm text-slate-400">Enter details</div>';
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center min-h-[80px] flex flex-col items-center justify-center transition-all" id="bmi-result">
                    <div className="text-sm text-slate-400 font-medium">Enter your height & weight</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Testimonials (Re-added below BMI) */}
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-500 flex-1 min-h-[250px] flex flex-col justify-between">
              <Quote className="absolute top-4 right-4 w-16 h-16 text-white/5 rotate-12" />
              <div className="relative z-10">
                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white mb-4 w-fit border border-white/10 uppercase tracking-wider">
                  Testimonials
                </div>
                <p className="text-white text-base font-medium leading-relaxed drop-shadow-sm">
                  "{testimonials[activeTestimonial].text}"
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-teal-600 shadow-sm">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{testimonials[activeTestimonial].author}</p>
                </div>
              </div>
            </div>

          </div>
        )
      }
    </div >
  );
}

