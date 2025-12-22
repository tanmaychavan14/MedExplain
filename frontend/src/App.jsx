import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import UploadReport from "./components/UploadReport";
import SummaryView from "./components/SummaryView";

function App() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState("");
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>MEDEXPLAIN</h1>
        <p className="tagline">
          Medical Report Summarizer for Rural Clinics
        </p>
      </header>

      {/* 🔐 If NOT logged in → show Login */}
      {!user && <Login onLogin={setUser} />}

      {/* 📄 If logged in → show upload */}
      {user && (
        <>
          <UploadReport user={user} onResult={setSummary} />
          {summary && <SummaryView summary={summary} />}
        </>
      )}
    </div>
  );
}

export default App;
