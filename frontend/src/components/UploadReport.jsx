import { use, useState } from "react";
import { uploadReport } from "../services/api";
import "./UploadReport.css";
export default function UploadReport({ user, onResult, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [reportType, setReportType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [language, setlanguage]=useState("english");
const [language, setLanguage] = useState("en");

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
      // Pass both summary and report info
      onResult({
        summary: result.summary,
        reportName: file.name.replace(/\.[^/.]+$/, "").toLowerCase(),
        reportType: reportType
      });
      
      // Notify parent component that upload was successful (to refresh report list)
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

  return (
    <div className="upload-card">
      <h2>Upload Medical Report</h2>
      <p className="subtitle">Select a PDF file to generate an easy-to-understand summary</p>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="file-upload-wrapper">
        <input 
          id="file-input"
          type="file" 
          accept=".pdf"
          onChange={e => {
            setFile(e.target.files[0]);
            setError(null);
          }}
          className="file-input-hidden"
        />
        <label htmlFor="file-input" className="file-input-label">
          <svg className="file-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span className="file-input-text">
            {file ? file.name : "Choose PDF File"}
          </span>
        </label>
        {file && (
          <div className="file-selected-indicator">
            ✓ File selected
          </div>
        )}
      </div>

      <div className="report-type-selector">
        <label>
          Report Type:
          <select
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
              setError(null);
            }}
            className="type-select"
          >
            <option value="">Select report type...</option>
            <option value="CBC">CBC (Complete Blood Count)</option>
            <option value="LIPID">Lipid Profile</option>
            <option value="LFT">LFT (Liver Function Test)</option>
            <option value="KFT">KFT (Kidney Function Test)</option>
            <option value="THYROID">Thyroid Function Test</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
      </div>
      <div className="report-type-selector">
  <label>
    Language:
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="type-select"
    >
      <option value="en">English</option>
      <option value="hi">Hindi</option>
      <option value="mr">Marathi</option>
    </select>
  </label>
</div>

      
      <button 
        className="upload-btn" 
        onClick={handleUpload} 
        disabled={loading || !file || !reportType}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span>
            Analyzing...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload & Summarize
          </>
        )}
      </button>
    </div>
  );
}
