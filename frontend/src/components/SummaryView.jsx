import ReactMarkdown from "react-markdown";
import "./SummaryView.css";

export default function SummaryView({ summary }) {
  return (
    <div className="summary-card">
      <ReactMarkdown>{summary}</ReactMarkdown>
    </div>
  );
}
