// import { useState } from "react";
// import "./App.css";
// import Login from "./components/Login";
// import UploadReport from "./components/UploadReport";
// import SummaryView from "./components/SummaryView";
// import ReportList from "./components/ReportList";
// import CompareReports from "./components/CompareReports";
// import UserProfile from "./components/UserProfile";
// import Chatbot from "./components/Chatbot";

// function App() {
//   const [user, setUser] = useState(null);
//   const [summary, setSummary] = useState("");
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [activeView, setActiveView] = useState("upload"); // "upload", "list", "compare"
//   const [showChatbot, setShowChatbot] = useState(false);
//   const [chatbotReport, setChatbotReport] = useState(null);

//   const handleLogout = () => {
//     setUser(null);
//     setSummary("");
//     setSelectedReport(null);
//     setActiveView("upload");
//     setShowChatbot(false);
//     setChatbotReport(null);
//   };

//   const handleOpenChatbot = (report) => {
//     setChatbotReport(report);
//     setShowChatbot(true);
//   };

//   const handleUploadSuccess = () => {
//     // Refresh report list after successful upload
//     setActiveView("list");
//   };

//   const handleReportSelect = async (report) => {
//     setSelectedReport(report);
//     // Load summary for selected report
//     try {
//       const { getReportSummary } = await import("./services/api");
//       const result = await getReportSummary(
//         report.reportName,
//         report.reportType,
//         user
//       );
//       setSummary(result.summary);
//       setActiveView("upload");
//        // Show summary view
//     } catch (err) {
//       console.error("Failed to load report summary:", err);
//       alert("Failed to load report summary: " + err.message);
//     }
//   };

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <h1>MEDEXPLAIN</h1>
//         <p className="tagline">
//           Medical Report Summarizer for Rural Clinics
//         </p>
//       </header>

//       {/* 🔐 If NOT logged in → show Login */}
//       {!user && <Login onLogin={setUser} />}

//       {/* 📄 If logged in → show main content */}
//       {user && (
//         <>
//           {/* User Profile with Logout */}
//           <UserProfile user={user} onLogout={handleLogout} />
          
//           {/* Navigation Tabs */}
//           <div className="nav-tabs">
//             <button
//               className={`nav-tab ${activeView === "upload" ? "active" : ""}`}
//               onClick={() => {
//                 setActiveView("upload");
//                 setSummary("");
//                 setSelectedReport(null);
//               }}
//             >
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//                 <polyline points="17 8 12 3 7 8"></polyline>
//                 <line x1="12" y1="3" x2="12" y2="15"></line>
//               </svg>
//               Upload
//             </button>
//             <button
//               className={`nav-tab ${activeView === "list" ? "active" : ""}`}
//               onClick={() => {
//                 setActiveView("list");
//                 setSummary("");
//               }}
//             >
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <line x1="8" y1="6" x2="21" y2="6"></line>
//                 <line x1="8" y1="12" x2="21" y2="12"></line>
//                 <line x1="8" y1="18" x2="21" y2="18"></line>
//                 <line x1="3" y1="6" x2="3.01" y2="6"></line>
//                 <line x1="3" y1="12" x2="3.01" y2="12"></line>
//                 <line x1="3" y1="18" x2="3.01" y2="18"></line>
//               </svg>
//               My Reports
//             </button>
//             <button
//               className={`nav-tab ${activeView === "compare" ? "active" : ""}`}
//               onClick={() => {
//                 setActiveView("compare");
//                 setSummary("");
//                 setSelectedReport(null);
//               }}
//             >
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <polyline points="16 18 22 12 16 6"></polyline>
//                 <polyline points="8 6 2 12 8 18"></polyline>
//               </svg>
//               Compare
//             </button>
//           </div>

//           {/* Main Content Area */}
//           <div className="main-content-wrapper">
//           {activeView === "upload" && (
//             <>
//               <UploadReport
//                 user={user}
//                 onResult={(result) => {
//                   if (typeof result === 'string') {
//                     // Legacy format - just summary string
//                     setSummary(result);
//                   } else {
//                     // New format - object with summary and report info
//                     setSummary(result.summary);
//                     setSelectedReport({
//                       reportName: result.reportName,
//                       reportType: result.reportType
//                     });
//                   }
//                 }}
//                 onUploadSuccess={handleUploadSuccess}
//               />
//               {summary && selectedReport && (
//                 <SummaryView 
//                   summary={summary} 
//                   report={selectedReport}
//                   onOpenChatbot={handleOpenChatbot}
//                 />
//               )}
//             </>
//           )}

//             {activeView === "list" && (
//               <ReportList
//                 user={user}
//                 onReportSelect={handleReportSelect}
//                 selectedReport={selectedReport}
//               />
//             )}

//             {activeView === "compare" && (
//               <CompareReports user={user} />
//             )}
//           </div>
//         </>
//       )}

//       {/* Chatbot */}
//       {showChatbot && chatbotReport && user && (
//         <Chatbot
//           user={user}
//           reportName={chatbotReport.reportName}
//           reportType={chatbotReport.reportType}
//           onClose={() => {
//             setShowChatbot(false);
//             setChatbotReport(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import "./App.css";

import Login from "./components/Login";
import UploadReport from "./components/UploadReport";
import SummaryView from "./components/SummaryView";
import ReportList from "./components/ReportList";
import CompareReports from "./components/CompareReports";
import UserProfile from "./components/UserProfile";
import Chatbot from "./components/Chatbot";

function App() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeView, setActiveView] = useState("upload");
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotReport, setChatbotReport] = useState(null);
  const [compareResult, setCompareResult] = useState(null);


  const handleLogout = () => {
    setUser(null);
    setSummary("");
    setSelectedReport(null);
    setActiveView("upload");
    setShowChatbot(false);
    setChatbotReport(null);
  };

  // const handleOpenChatbot = (report) => {
  //   setChatbotReport(report);
  //   setShowChatbot(true);
  // };
// In App.jsx
const handleOpenChatbot = async (report) => {
  // If report was just uploaded, add a small delay
  if (!report.id || report.id === 'temp') {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  setChatbotReport(report);
  setShowChatbot(true);
};
  const handleReportSelect = async (report) => {
    setSelectedReport(report);
    try {
      const { getReportSummary } = await import("./services/api");
      const result = await getReportSummary(
        report.reportName,
        report.reportType,
        user
      );
      setSummary(result.summary);
    } catch (err) {
      console.error(err);
      alert("Failed to load report summary");
    }
  };

  return (
    <div className="app-container">

      {/* ================= HEADER ================= */}
      <header className="app-header">
        <div className="header-left">
          <h1>MEDEXPLAIN</h1>
          <p className="tagline">Medical Report Summarizer for Rural Clinics</p>
        </div>

        {user && (
          <div className="header-right">
            <UserProfile user={user} onLogout={handleLogout} />
          </div>
        )}
      </header>

      {/* ================= LOGIN ================= */}
      {!user && (
        <div className="login-center-wrapper">
  <Login onLogin={setUser} />
</div>

      )}

      {/* ================= MAIN APP ================= */}
      {user && (
        <>
          {/* -------- NAV TABS -------- */}
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeView === "upload" ? "active" : ""}`}
              onClick={() => {
                setActiveView("upload");
                setSummary("");
                setSelectedReport(null);
              }}
            >
              Upload
            </button>

            <button
              className={`nav-tab ${activeView === "list" ? "active" : ""}`}
              onClick={() => {
                setActiveView("list");
                setSummary("");
                setSelectedReport(null);
              }}
            >
              My Reports
            </button>

            <button
              className={`nav-tab ${activeView === "compare" ? "active" : ""}`}
              onClick={() => {
                setActiveView("compare");
                setSummary("");
                setSelectedReport(null);
              }}
            >
              Compare
            </button>
          </div>

          {/* -------- CONTENT -------- */}
          <div className="main-content-wrapper">

            {/* ========== UPLOAD VIEW ========== */}
            {activeView === "upload" && !summary && (
              <div className="centered-view">
                <UploadReport
                  user={user}
                  onResult={(res) => {
                    setSummary(res.summary);
                    // setSelectedReport({
                    //   reportName: res.reportName,
                    //   reportType: res.reportType
                    // });
                    setSelectedReport(res);
                  }}
                />
              </div>
            )}
{activeView === "upload" && summary && selectedReport && (
  <div className="split-view">

    {/* LEFT: Upload Form */}
    <div className="split-left">
      <UploadReport
        user={user}
        onResult={(res) => {
          setSummary(res.summary);
          // setSelectedReport({
          //   reportName: res.reportName,
          //   reportType: res.reportType
          // });
          setSelectedReport(res);
        }}
      />
    </div>

    {/* RIGHT: Summary */}
    <div className="split-right">
      <SummaryView
        summary={summary}
        report={selectedReport}
        onOpenChatbot={handleOpenChatbot}
      />
    </div>

  </div>
)}


            {/* ========== REPORTS VIEW ========== */}
            {activeView === "list" && (
              <div className="split-view">
                <div className="split-left">
                  <ReportList
                    user={user}
                    onReportSelect={handleReportSelect}
                    selectedReport={selectedReport}
                  />
                </div>

                <div className="split-right">
                  {summary && selectedReport ? (
                    <SummaryView
                      summary={summary}
                      report={selectedReport}
                      onOpenChatbot={handleOpenChatbot}
                    />
                  ) : (
                    <div className="empty-selection-state">
                      <p>Select a report to view its summary</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========== COMPARE VIEW ========== */}
  {activeView === "compare" && (
              <CompareReports user={user} />
            )}




          </div>
        </>
      )}

      {/* ================= CHATBOT ================= */}
      {showChatbot && chatbotReport && user && (
        <Chatbot
          user={user}
          reportName={chatbotReport.reportName}
          reportType={chatbotReport.reportType}
          onClose={() => {
            setShowChatbot(false);
            setChatbotReport(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
