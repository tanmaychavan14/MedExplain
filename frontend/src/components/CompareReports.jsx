import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { getReports, compareReports } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  BarChart2,
  ArrowRight,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader,
  ArrowLeftRight,
  TrendingUp,
  Sparkles,
  Zap,
  History,
  ClipboardCheck,
  Stethoscope,
  Activity,
  Printer
} from "lucide-react";


export default function CompareReports({ user }) {
  const [reports, setReports] = useState([]);
  const [oldReport, setOldReport] = useState(null);
  const [newReport, setNewReport] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReports();
  }, [user]);

  async function loadReports() {
    try {
      const data = await getReports(user);
      setReports(data || []);
    } catch (err) {
      console.error("Failed to load reports:", err);
    }
  }

  async function handleCompare() {
    if (!oldReport || !newReport) {
      setError("Please select both reports to compare");
      return;
    }

    if (oldReport.reportName === newReport.reportName &&
      oldReport.reportType === newReport.reportType) {
      setError("Please select two different reports");
      return;
    }

    setLoading(true);
    setError(null);
    setComparisonData(null);

    try {
      const params = {
        oldReportName: oldReport.reportName,
        oldReportType: oldReport.reportType,
        newReportName: newReport.reportName,
        newReportType: newReport.reportType,
        language: "en"
      };

      const result = await compareReports(params, user);

      let parsedData;
      try {
        // Try parsing only if it looks like JSON/object
        parsedData = typeof result.comparison === 'string'
          ? JSON.parse(result.comparison)
          : result.comparison;
      } catch (e) {
        console.warn("Could not parse comparison JSON, falling back to raw text", e);
        parsedData = {
          overall_status: "Analysis Check",
          status_color: "blue",
          changes: [],
          summary_markdown: result.comparison || "No detailed analysis available."
        };
      }
      setComparisonData(parsedData);

    } catch (err) {
      setError(err.message || "Failed to compare reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  const getStatusColor = (color) => {
    switch (color?.toLowerCase()) {
      case 'green': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'red': return 'bg-red-100 text-red-700 border-red-200';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'orange': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const ReportSelectCard = ({ label, selected, onSelect, icon: Icon, colorClass }) => (
    <div className="flex-1 min-w-[300px]">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <h3 className="font-semibold text-slate-700">{label}</h3>
      </div>

      <div className="relative group">
        <select
          value={selected ? `${selected.reportName}-${selected.reportType}` : ""}
          onChange={(e) => {
            if (e.target.value) {
              const [name, type] = e.target.value.split("-");
              const report = reports.find(
                (r) => r.reportName === name && r.reportType === type
              );
              onSelect(report);
              setError(null);
            }
          }}
          className="w-full p-4 bg-white border border-slate-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm group-hover:border-slate-300"
        >
          <option value="">Select a report...</option>
          {reports.map((report, index) => (
            <option
              key={index}
              value={`${report.reportName}-${report.reportType}`}
            >
              {report.reportName} ({report.reportType}) - {formatDate(report.createdAt)}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ArrowRight className="w-4 h-4 rotate-90" />
        </div>
      </div>

      {selected && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 relative group-hover:border-teal-300 transition-colors">
          {/* Medical File Tab Effect */}
          <div className={`absolute top-0 right-4 w-16 h-1 rounded-b-md ${selected.reportType === 'CBC' ? 'bg-rose-400' : 'bg-slate-300'}`}></div>

          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg border ${selected.reportType === 'CBC' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">{selected.reportName}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md uppercase tracking-wider border border-slate-200">
                  {selected.reportType}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(selected.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner - Clinical Dashboard Style (Reduced Size) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-5">
          <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-teal-600 shadow-sm shrink-0">
            <ClipboardCheck className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Comparison</h2>
            <p className="text-slate-500 mt-1 text-sm leading-relaxed max-w-2xl">
              Compare sequential medical reports to track biomarkers and analyze health progression with AI.
            </p>
          </div>
        </div>
      </div>


      {/* Selection Area - Clean Professional Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 relative">

        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <ReportSelectCard
            label="Baseline Report"
            selected={oldReport}
            onSelect={setOldReport}
            icon={History}
            colorClass="text-slate-400"
          />

          <div className="flex items-center justify-center shrink-0">
            <div className="p-3 bg-slate-50 rounded-full text-slate-400 border border-slate-200 rotate-90 lg:rotate-0">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          <ReportSelectCard
            label="Follow-up Report"
            selected={newReport}
            onSelect={setNewReport}
            icon={Activity}
            colorClass="text-teal-500"
          />
        </div>

        {error && (
          <div className="mt-6 mx-auto max-w-lg p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center gap-3 text-red-600 font-medium animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
          <button
            onClick={handleCompare}
            disabled={loading || !oldReport || !newReport}
            className="group relative flex items-center justify-center gap-2 px-8 py-3 w-full md:w-auto min-w-[200px] bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <ArrowLeftRight className="w-5 h-5" />
                <span>Compare Reports</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Area - New UI for JSON Response */}
      {comparisonData && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

          {/* Overall Status Banner - Clinical Note Style */}
          <div className={`p-6 rounded-2xl border-l-[6px] bg-white shadow-sm flex flex-col md:flex-row items-center gap-6 ${comparisonData.status_color === 'green' ? 'border-emerald-500' :
            comparisonData.status_color === 'red' ? 'border-rose-500' :
              comparisonData.status_color === 'orange' ? 'border-amber-500' :
                'border-slate-400'
            }`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Clinical Overview</h3>
              </div>
              <p className="text-2xl font-bold text-slate-800">{comparisonData.overall_status}</p>
            </div>

            {/* Print Button (Screen Only) */}
            <div className="flex items-center gap-3 no-print">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print Analysis
              </button>
            </div>

            {/* Dynamic Pulse for Health Score (Simulated) */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 print:hidden">
              <div className={`w-2.5 h-2.5 rounded-full ${comparisonData.status_color === 'green' ? 'bg-emerald-500 animate-pulse' :
                comparisonData.status_color === 'red' ? 'bg-rose-500 animate-pulse' :
                  'bg-slate-400'
                }`}></div>
              <span className="text-sm font-semibold text-slate-600">AI Analysis Active</span>
            </div>
          </div>

          {/* Data Visualization Section */}
          {comparisonData.visualizations && comparisonData.visualizations.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <BarChart2 className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-800">Trend Analysis</h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData.visualizations.map(v => ({
                      name: v.label,
                      Old: v.old_value,
                      New: v.new_value,
                      unit: v.unit
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barGap={8}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#94A3B8', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: '#F1F5F9' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value, name, props) => [`${value} ${props.payload.unit || ''}`, name]}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
                    <Bar dataKey="Old" name="Previous Report" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="New" name="Current Report" fill="#0D9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-10 mb-6 border-b border-slate-200 pb-4">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-bold text-slate-800">Observation Findings</h3>
          </div>

          {/* Clinical Observation Cards */}
          <div className="grid grid-cols-1 gap-4">
            {comparisonData.changes?.map((change, idx) => (
              <div key={idx}
                className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-teal-400 transition-all duration-300 relative overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row gap-6">

                  {/* Left: Parameter & Status */}
                  <div className="md:w-1/4 shrink-0">
                    <h4 className="font-bold text-slate-900 text-lg">{change.parameter}</h4>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border bg-slate-50 border-slate-200 text-slate-600">
                      <span className={`w-1.5 h-1.5 rounded-full ${change.change_type?.toLowerCase().includes('improve') ? 'bg-emerald-500' :
                        change.change_type?.toLowerCase().includes('worsen') ? 'bg-rose-500' :
                          'bg-slate-400'
                        }`}></span>
                      {change.change_type}
                    </div>
                  </div>

                  {/* Right: Details & Note */}
                  <div className="flex-1 space-y-3">
                    <p className="text-slate-700 font-medium leading-relaxed">{change.details}</p>

                    <div className="flex items-start gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <ClipboardCheck className="w-4 h-4 shrink-0 mt-0.5 text-teal-600" />
                      <span className="italic">{change.significance}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Analysis */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <FileText className="w-5 h-5 text-slate-500" />
              <h3 className="font-bold text-slate-800">Detailed Explanation</h3>
            </div>
            <div className="p-6 prose prose-slate max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-600 prose-strong:text-slate-900">
              <ReactMarkdown>{comparisonData.summary_markdown}</ReactMarkdown>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{comparisonData.disclaimer || "Disclaimer: This AI analysis is for educational purposes only. Always verify with a doctor."}</p>
          </div>

        </div>
      )}

      {/* Empty State / Tips */}
      {!comparisonData && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎯",
              title: "Consistency",
              text: "Choose reports of the same type (e.g., both CBC) for accurate results"
            },
            {
              icon: "📅",
              title: "Timeline",
              text: "Select an older report on the left and a newer one on the right"
            },
            {
              icon: "📈",
              title: "Trends",
              text: "Look for improvements or concerning changes in your vital metrics"
            }
          ].map((tip, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
              <div className="text-2xl mb-3">{tip.icon}</div>
              <h4 className="font-bold text-slate-700 mb-2">{tip.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
