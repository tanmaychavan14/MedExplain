import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, Bot, AlertCircle, Info, Stethoscope, Activity, ClipboardList } from "lucide-react";
import InsightCard from "./InsightCard";
import ReportCharts from "./ReportCharts";

export default function SummaryView({ summary, report, onOpenChatbot }) {
  let structuredData = null;
  let isJson = false;

  try {
    // Attempt to parse JSON summary (for new Modular Insights)
    // Clean potential markdown code blocks
    let cleanSummary = summary.trim();
    if (cleanSummary.startsWith("```json")) {
      cleanSummary = cleanSummary.slice(7).trim();
    } else if (cleanSummary.startsWith("```")) {
      cleanSummary = cleanSummary.slice(3).trim();
    }
    if (cleanSummary.endsWith("```")) {
      cleanSummary = cleanSummary.slice(0, -3).trim();
    }

    // Attempt to parse JSON summary (for new Modular Insights)
    if (cleanSummary.startsWith("{")) {
      structuredData = JSON.parse(cleanSummary);
      isJson = true;
    }
  } catch (e) {
    // Fallback to markdown if parsing fails
    isJson = false;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Summary Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col relative">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-sm sticky top-0 z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Report Summary</h2>
              {report && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {report.reportType}
                  </span>
                  <span className="text-xs text-slate-400 max-w-[150px] truncate">
                    {report.reportName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {report && onOpenChatbot && (
            <button
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl shadow-md hover:shadow-lg hover:from-teal-500 hover:to-cyan-500 transition-all duration-200"
              onClick={() => onOpenChatbot(report)}
              title="Ask AI Assistant about this report"
            >
              <Bot className="w-5 h-5 group-hover:animate-bounce" />
              <span className="font-medium">Ask AI Assistant</span>
            </button>
          )}
        </div>

        <div className="p-6">
          {isJson && structuredData ? (
            <div className="space-y-8">
              {/* Modular Insight Blocks */}
              {structuredData.insights && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {structuredData.insights.map((card, idx) => (
                    <InsightCard
                      key={idx}
                      emoji={card.emoji}
                      category={card.category}
                      insight={card.insight}
                      status={card.status}
                    />
                  ))}
                </div>
              )}

              {/* Visualizations Section */}
              {structuredData.visualizations && structuredData.visualizations.length > 0 && (
                <div className="py-2">
                  <ReportCharts visualizations={structuredData.visualizations} />
                </div>
              )}

              {/* Detailed Findings Text */}
              {structuredData.summary_text && (
                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {structuredData.summary_text}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ) : (
            /* Legacy Markdown View */
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900 prose-strong:font-bold prose-a:text-teal-600 hover:prose-a:text-teal-500">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Info className="w-4 h-4" />
          <span>AI-generated summary • Always consult a doctor for professional advice</span>
        </div>
      </div>

      {/* Helper Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-5 border border-blue-100 flex gap-4">
          <div className="mt-1 bg-white p-2 rounded-full shadow-sm text-blue-500 h-fit">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Understanding Your Report</h4>
            <p className="text-sm text-blue-700/80 leading-relaxed">
              This summary highlights key findings. Look for bolded terms and "Abnormal" flags.
              The AI simplifies technical jargon into plain English.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100 flex gap-4">
          <div className="mt-1 bg-white p-2 rounded-full shadow-sm text-amber-500 h-fit">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 mb-1">Medical Disclaimer</h4>
            <p className="text-sm text-amber-700/80 leading-relaxed">
              This is an automated analysis and may contain errors. It is not a substitute for professional medical advice.
              Please verify all critical information with your doctor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
