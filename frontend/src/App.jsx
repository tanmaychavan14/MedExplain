
import { useState } from "react";
// import "./App.css"; // Removed custom CSS
import Login from "./components/Login";
import UploadReport from "./components/UploadReport";
import SummaryView from "./components/SummaryView";
import ReportList from "./components/ReportList";
import CompareReports from "./components/CompareReports";
import UserProfile from "./components/UserProfile";
import Chatbot from "./components/Chatbot";
import Header from "./components/Header";
import NavigationTabs from "./components/NavigationTabs";
import Footer from "./components/Footer";
import BodyGuide from "./components/BodyGuide";

function App() {
  // User state
  const [user, setUser] = useState(null);

  // Report state
  const [summary, setSummary] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  // UI state
  const [activeView, setActiveView] = useState("upload");
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotReport, setChatbotReport] = useState(null);

  // Handlers
  const handleLogout = () => {
    setUser(null);
    resetReportState();
  };

  const resetReportState = () => {
    setSummary("");
    setSelectedReport(null);
    setShowChatbot(false);
    setChatbotReport(null);
  };

  const handleTabChange = (view) => {
    setActiveView(view);
    resetReportState();
  };

  const handleOpenChatbot = async (report) => {
    if (!report.id || report.id === 'temp') {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setChatbotReport(report);
    setShowChatbot(true);
  };

  const handleCloseChatbot = () => {
    setShowChatbot(false);
    setChatbotReport(null);
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

  const handleUploadResult = (result) => {
    setSummary(result.summary);
    setSelectedReport(result);
  };

  // Render helpers
  const renderUploadView = () => {
    if (!summary) {
      return (
        <div className="flex justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          <UploadReport user={user} onResult={handleUploadResult} summary={summary} />
        </div>
      );
    }

    return (
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[600px] items-start animate-fade-in">
        {/* Upload/List Section */}
        <div className="w-full order-1">
          <UploadReport user={user} onResult={handleUploadResult} summary={summary} />
        </div>

        {/* Summary Section */}
        <div className="w-full order-2">
          <SummaryView
            summary={summary}
            report={selectedReport}
          />
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-140px)] min-h-[600px] animate-fade-in">
      <div className="lg:col-span-4 overflow-y-auto pr-2 custom-scrollbar">
        <ReportList
          user={user}
          onReportSelect={handleReportSelect}
          selectedReport={selectedReport}
        />
      </div>
      <div className="lg:col-span-8 overflow-y-auto pl-2 custom-scrollbar">
        {summary && selectedReport ? (
          <SummaryView
            summary={summary}
            report={selectedReport}
            onOpenChatbot={handleOpenChatbot}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center border-2 border-dashed border-[var(--color-surface-200)] rounded-2xl bg-[var(--color-surface-50)]">
            <div className="w-16 h-16 bg-[var(--color-surface-100)] rounded-full flex items-center justify-center mb-4 text-3xl shadow-sm">
              📋
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">No Report Selected</h3>
            <p className="text-[var(--color-text-tertiary)] mt-1 max-w-sm font-medium">Select a report from the list on the left to view its detailed AI summary and analysis.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case "upload":
        return renderUploadView();
      case "list":
        return renderListView();
      case "compare":
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <CompareReports user={user} />
          </div>
        );
      case "guide":
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <BodyGuide />
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-50)] flex flex-col font-sans text-[var(--color-text-primary)]">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <Login onLogin={setUser} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-50)] flex flex-col font-sans text-[var(--color-text-primary)]">
      <Header user={user} onLogout={handleLogout} />

      <NavigationTabs activeView={activeView} onTabChange={handleTabChange} />

      <div className="flex-1 w-full relative z-0">
        {renderActiveView()}
      </div>

      {showChatbot && chatbotReport && (
        <Chatbot
          user={user}
          reportName={chatbotReport.reportName}
          reportType={chatbotReport.reportType}
          onClose={handleCloseChatbot}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
