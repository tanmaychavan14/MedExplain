import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { createChatSession, sendChatMessage, sendVoiceMessage } from "../services/api";
import {
  MessageSquare,
  X,
  Send,
  Mic,
  User,
  Bot,
  Loader,
  StopCircle,
  AlertCircle
} from "lucide-react";

export default function Chatbot({ user, reportName, reportType, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [language, setLanguage] = useState("en");
  const [initError, setInitError] = useState(null);

  // Voice mode states
  const [voiceMode, setVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const hasInitialized = useRef(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSession = async () => {
    if (!reportName || !reportType) {
      setInitializing(false);
      return;
    }

    try {
      setInitializing(true);
      setInitError(null);
      console.log("Creating session for:", { reportName, reportType });

      let session = null;
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts && !session) {
        try {
          session = await createChatSession(reportName, reportType, language, user);
          if (session && session.sessionId) {
            break;
          }
        } catch (err) {
          console.log(`Attempt ${attempts + 1} failed, retrying...`);
          if (attempts < maxAttempts - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempts + 1)));
          }
        }
        attempts++;
      }

      if (!session || !session.sessionId) {
        // Show alert and close chatbot
        showReportAlert();
        onClose();
        throw new Error("Unable to create session after retries");
      }

      setSessionId(session.sessionId);
      setMessages(session.messages || []);
    } catch (error) {
      console.error("Failed to initialize chat session:", error);
      setInitError("Unable to open chatbot. Please open from 'My Reports' section.");

      setTimeout(() => {
        if (!sessionId) {
          showReportAlert();
          onClose();
        }
      }, 1000);
    } finally {
      setInitializing(false);
    }
  };

  const showReportAlert = () => {
    alert(
      "⚠️ Unable to open chatbot right now.\n\n" +
      "Please wait a moment and try again from 'My Reports' section.\n\n" +
      "The report is being processed and will be ready shortly."
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || loading) {
      return;
    }

    if (!sessionId) {
      showReportAlert();
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage("");

    const newUserMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setLoading(true);
    setInitError(null);

    try {
      const response = await sendChatMessage(sessionId, userMessage, language, user);

      const botMessage = {
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);

      if (error.message.includes("Session not found") || error.message.includes("404")) {
        showReportAlert();
        onClose();
      } else {
        alert("⚠️ Unable to send message.\n\nPlease check your connection and try again.");
        setMessages((prev) => prev.filter((msg, idx) => idx !== prev.length - 1));
      }
    } finally {
      setLoading(false);
    }
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const options = {
        mimeType: 'audio/webm;codecs=opus'
      };

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        await sendVoiceMessageToBackend(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("🎤 Recording started...");
    } catch (error) {
      console.error("Error starting recording:", error);
      setInitError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("🎤 Recording stopped");
    }
  };

  const sendVoiceMessageToBackend = async (audioBlob) => {
    if (!sessionId) {
      showReportAlert();
      return;
    }

    setLoading(true);
    setInitError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);

      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];

        const response = await sendVoiceMessage(
          sessionId,
          base64Audio,
          language,
          voiceGender,
          user
        );

        const userMessage = {
          role: "user",
          content: response.data.userText,
          timestamp: new Date(),
          isVoice: true
        };
        setMessages((prev) => [...prev, userMessage]);

        const botMessage = {
          role: "assistant",
          content: response.data.responseText,
          timestamp: new Date(),
          isVoice: true
        };
        setMessages((prev) => [...prev, botMessage]);

        if (response.data.responseAudio) {
          playAudioResponse(response.data.responseAudio);
        }
      };
    } catch (error) {
      console.error("Failed to send voice message:", error);

      if (error.message.includes("Session not found") || error.message.includes("404")) {
        showReportAlert();
        onClose();
      } else {
        alert("⚠️ Unable to process voice message.\n\nPlease check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const playAudioResponse = (base64Audio) => {
    try {
      const audioData = atob(base64Audio);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);

      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }

      const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      audioRef.current = new Audio(audioUrl);
      setIsPlayingAudio(true);

      audioRef.current.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      audioRef.current.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlayingAudio(false);
    }
  };

  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode);
    if (isRecording) {
      stopRecording();
    }
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
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

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-8 sm:right-8">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">AI Assistant</h3>
              <p className="text-xs text-teal-50 truncate max-w-[150px]">
                {reportName} ({reportType})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-2 py-1 outline-none focus:bg-white/20 cursor-pointer"
            >
              <option value="en" className="text-slate-800">English</option>
              <option value="hi" className="text-slate-800">Hindi</option>
              <option value="mr" className="text-slate-800">Marathi</option>
            </select>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-slate-50 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={chatContainerRef}>
          {initializing ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
              <Loader className="w-8 h-8 animate-spin text-teal-500" />
              <p className="text-sm">Initializing conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <MessageSquare className="w-8 h-8 text-teal-400" />
              </div>
              <p className="text-slate-600 font-medium mb-1">Start a conversation!</p>
              <p className="text-sm">Ask me anything about your medical report.</p>
              <div className="mt-6 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                💡 Try: "What does my hemoglobin level mean?"
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
                  ${message.role === "user" ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-600"}
                `}>
                  {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`
                  max-w-[80%] rounded-2xl p-3 shadow-sm text-sm
                  ${message.role === "user"
                    ? "bg-teal-600 text-white rounded-tr-none"
                    : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"}
                `}>
                  <div className={`prose prose-sm max-w-none ${message.role === "user" ? "prose-invert" : ""}`}>
                    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>

                  <div className={`flex items-center gap-1 mt-1 text-[10px] opacity-70 ${message.role === "user" ? "justify-end text-teal-100" : "text-slate-400"}`}>
                    {message.isVoice && <Mic className="w-3 h-3" />}
                    <span>{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-teal-600" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex gap-1 items-center">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Banner */}
        {initError && (
          <div className="bg-amber-50 px-4 py-2 border-t border-amber-100 flex items-center gap-2 text-xs text-amber-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {initError}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={toggleVoiceMode}
              className={`p-1.5 rounded-lg transition-all ${voiceMode ? 'bg-teal-100 text-teal-600' : 'text-slate-400 hover:bg-slate-50'}`}
              title={voiceMode ? "Switch to text" : "Switch to voice"}
            >
              {voiceMode ? <Mic className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
            </button>
            {voiceMode && (
              <select
                value={voiceGender}
                onChange={(e) => setVoiceGender(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-teal-500"
              >
                <option value="female">Female Voice</option>
                <option value="male">Male Voice</option>
              </select>
            )}
          </div>

          {!voiceMode ? (
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={loading || initializing}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || initializing || !inputMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-50 disabled:hover:bg-teal-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={loading || initializing}
                className={`
                  w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all
                  ${isRecording
                    ? "bg-red-500 text-white animate-pulse hover:bg-red-600"
                    : "bg-teal-600 text-white hover:bg-teal-500 hover:scale-105"}
                `}
              >
                {isRecording ? <StopCircle className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              {isRecording && (
                <span className="text-xs font-medium text-red-500 animate-pulse">
                  Recording...
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}