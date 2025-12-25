import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";


import { createChatSession, sendChatMessage, getChatSession } from "../services/api";
import "./Chatbot.css";

export default function Chatbot({ user, reportName, reportType,   onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [language, setLanguage] = useState("en");
const [initError, setInitError] = useState(null); 
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
const hasInitialized = useRef(false);
const hasShownError = useRef(false);

useEffect(() => {
  hasInitialized.current = false;
   setInitError(null);
}, [reportName, reportType]);

useEffect(() => {
  if (!reportName || !reportType || !user) return;
  if (hasInitialized.current) return;

  hasInitialized.current = true;
  initializeSession();
}, [reportName, reportType, user]);


  // useEffect(() => {
  //   initializeSession();
  // }, [reportName, reportType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const initializeSession = async () => {
  //   if (!reportName || !reportType) {
  //     setInitializing(false);
  //     return;
  //   }

  //   try {
  //     setInitializing(true);
  //     const session = await createChatSession(reportName, reportType, language,user);
  //     setSessionId(session.sessionId);
  //     setMessages(session.messages || []);
  //   } catch (error) {
  //     console.error("Failed to initialize chat session:", error);
  //     alert("Failed to initialize chat. Please try again.");
  //   } finally {
  //     setInitializing(false);
  //   }
  // };

  const initializeSession = async () => {
  if (!reportName || !reportType) {
    setInitializing(false);
    return;
  }

  try {
    setInitializing(true);
     setInitError(null);
    console.log("Creating session for:", { reportName, reportType }); // Debug log
    
    const session = await createChatSession(reportName, reportType, language, user);
    
    if (!session || !session.sessionId) {
      throw new Error("Invalid session response");
    }
    
    setSessionId(session.sessionId);
    setMessages(session.messages || []);
  } catch (error) {
    console.error("Failed to initialize chat session:", error);
    
  if (!hasShownError.current) {
    hasShownError.current = true;
    alert("Please open chat from My Report List");
  }

    onClose(); // Close the chatbot on error
  } finally {
    setInitializing(false);
  }
};
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || loading || !sessionId) {
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage("");
    
    // Add user message immediately
    const newUserMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setLoading(true);

    try {
      const response = await sendChatMessage(sessionId, userMessage,language, user);
      
      // Add bot response
      const botMessage = {
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
      
      // Remove the user message if it failed
      setMessages((prev) => prev.filter((msg, idx) => idx !== prev.length - 1));
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (initializing) {
    return (
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h3>Chat about your report</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="chatbot-loading">
          <div className="loading-spinner"></div>
          <p>Initializing chat...</p>
        </div>
      

      </div>
    );
  }

  return (
    <div className="chatbot-container">
      {/* <div className="chatbot-header">

        <div className="chatbot-header-info">
          <h3>Chat about your report</h3>
          <p className="chatbot-subtitle">
            Ask questions about: {reportName} ({reportType})
          </p>
        </div>
         <select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  className="chatbot-language-select"
>
  <option value="en">English</option>
  <option value="hi">Hindi</option>
  <option value="mr">Marathi</option>
</select>
        <button className="close-btn" onClick={onClose} title="Close chat">
          ×
        </button>
       

      </div> */}
<div className="chatbot-header">
  <div className="chatbot-header-info">
    <h3>Chat about your report</h3>
    <p className="chatbot-subtitle">
      Ask questions about: {reportName} ({reportType})
    </p>
  </div>

  <div className="chatbot-header-actions">
   

    <button className="close-btn" onClick={onClose} title="Close chat">
      ×
    </button>
     <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="chatbot-language-select"
    >
      <option value="en">English</option>
      <option value="hi">Hindi</option>
      <option value="mr">Marathi</option>
    </select>
  </div>
</div>

      <div className="chatbot-messages" ref={chatContainerRef}>
        {messages.length === 0 ? (
          <div className="chatbot-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>Start a conversation! Ask me anything about your medical report.</p>
            <p className="chatbot-hint">
              Example: "What does my hemoglobin level mean?"
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.role === "user" ? "user-message" : "bot-message"}`}
            >
              <div className="message-content">
                {message.role === "assistant" && (
                  <div className="bot-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                )}
                <div className="message-bubble">
                  {/* <p>{message.content}</p> */}
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
  {message.content}
</ReactMarkdown>

                  {message.timestamp && (
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="chat-message bot-message">
            <div className="message-content">
              <div className="bot-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div className="message-bubble typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chatbot-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a question about your report..."
          className="chatbot-input"
          disabled={loading || !sessionId}
        />
        
        <button
          type="submit"
          className="chatbot-send-btn"
          disabled={loading || !inputMessage.trim() || !sessionId}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}

