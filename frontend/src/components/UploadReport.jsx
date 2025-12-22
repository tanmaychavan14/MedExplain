import { useState } from "react";
import { uploadReport } from "../services/api";
import { hashFile } from "../utils/hashFile";

export default function UploadReport({ user, onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file || !user) {
      alert("User not logged in or file missing");
      return;
    }

    setLoading(true);

    try {
      const hash = await hashFile(file);
      const result = await uploadReport(file, hash, user.uid);
      onResult(result.summary);
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-card">
      <h2>Upload Medical Report</h2>
      <p className="subtitle">Select a PDF file to generate an easy-to-understand summary</p>
      
      <div className="file-upload-wrapper">
        <input 
          id="file-input"
          type="file" 
          accept=".pdf"
          onChange={e => setFile(e.target.files[0])}
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
      
      <button 
        className="upload-btn" 
        onClick={handleUpload} 
        disabled={loading || !file}
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
