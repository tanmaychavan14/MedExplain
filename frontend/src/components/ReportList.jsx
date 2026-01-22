import { useState, useEffect } from "react";
import { getReports } from "../services/api";
import { FileText, Calendar, ChevronRight, Loader, RefreshCw, AlertCircle, ArrowUpDown } from "lucide-react";

export default function ReportList({ user, onReportSelect, selectedReport }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("newest");

  // Filter and Sort Logic
  const filteredReports = reports
    .filter((report) => filter === "ALL" || report.reportType === filter)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  useEffect(() => {
    loadReports();
  }, [user]);

  async function loadReports() {
    try {
      setLoading(true);
      setError(null);
      const data = await getReports(user);
      setReports(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load reports:", err);
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

  const getReportTypeStyles = (type) => {
    const styles = {
      CBC: "bg-red-50 text-red-700 border-red-100",
      LIPID: "bg-blue-50 text-blue-700 border-blue-100",
      LFT: "bg-amber-50 text-amber-700 border-amber-100",
      KFT: "bg-emerald-50 text-emerald-700 border-emerald-100",
      THYROID: "bg-purple-50 text-purple-700 border-purple-100",
      DIABETES: "bg-rose-50 text-rose-700 border-rose-100",
      OTHER: "bg-slate-50 text-slate-700 border-slate-100"
    };
    return styles[type] || styles.OTHER;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
        <Loader className="w-8 h-8 animate-spin text-sky-500" />
        <p className="font-medium">Loading your reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
        <p className="text-red-900 font-semibold mb-1">Failed to load reports</p>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium shadow-sm"
          onClick={loadReports}
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No Reports Yet</h3>
        <p className="text-slate-500 max-w-xs mx-auto mb-6">
          Upload your first medical report to start tracking your health journey.
        </p>
        <div className="bg-sky-50 text-sky-700 px-4 py-3 rounded-xl text-sm font-medium">
          💡 Tip: Go to the Upload tab to get started
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Filters & Header */}
      <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800">Your Reports</h3>
            <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full border border-teal-100">
              {filteredReports.length}
            </span>
          </div>
          <button
            className="p-2 hover:bg-teal-50 rounded-lg text-slate-400 hover:text-teal-600 transition-colors"
            onClick={loadReports}
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills & Sort Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Scrollable Filter Pills */}
          <div className="flex-1 overflow-x-auto no-scrollbar flex gap-2 pb-1 mask-fade-right">
            {["ALL", "CBC", "LIPID", "THYROID", "OTHER"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`
                    px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border
                    ${filter === type
                    ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"}
                  `}
              >
                {type === "ALL" ? "All" : type}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0 group">
            <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 transition-colors pointer-events-none" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-full text-[11px] font-bold text-slate-600 bg-white border border-slate-200 outline-none cursor-pointer hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50/50 transition-all appearance-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
        {filteredReports.length > 0 ? (
          filteredReports.map((report, index) => {
            const isSelected =
              selectedReport &&
              selectedReport.reportName === report.reportName &&
              selectedReport.reportType === report.reportType;

            return (
              <div
                key={index}
                onClick={() => onReportSelect(report)}
                className={`
                  group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border
                  ${isSelected
                    ? "bg-teal-50 border-teal-200 shadow-sm"
                    : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"}
                `}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getReportTypeStyles(report.reportType)}`}>
                        {report.reportType}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(report.createdAt)}
                      </span>
                    </div>
                    <h4 className={`font-semibold truncate ${isSelected ? "text-teal-900" : "text-slate-700"}`}>
                      {report.reportName}
                    </h4>
                  </div>

                  <ChevronRight className={`
                    w-5 h-5 transition-transform duration-200
                    ${isSelected ? "text-teal-500 translate-x-1" : "text-slate-300 group-hover:text-slate-400"}
                  `} />
                </div>

                {isSelected && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-teal-500 rounded-r-full" />
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2">
              <FileText className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-400">No reports found</p>
          </div>
        )}
      </div>
    </div>
  );
}

