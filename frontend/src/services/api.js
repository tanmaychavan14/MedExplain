const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";


async function getAuthHeaders(user) {
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  const idToken = await user.getIdToken();
  return {
    "Authorization": `Bearer ${idToken}`,
  };
}


async function authenticatedFetch(url, options = {}, user) {
  const headers = {
    ...(await getAuthHeaders(user)),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

// ==================== AUTH ROUTES ====================

/**
 * Get current user information
 */
export async function getCurrentUser(user) {
  return authenticatedFetch("/auth/me", { method: "GET" }, user);
}

// ==================== REPORT ROUTES ====================

/**
 * Upload a medical report
 * @param {File} file - The PDF file to upload
 * @param {string} reportType - Type of report (e.g., "CBC", "LIPID", etc.)
 * @param {string} language - Language code (default: "en")
 * @param {Object} user - Firebase user object
 */
export async function uploadReport(file, reportType, language = "en", user) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("reportType", reportType);
  formData.append("language", language);

  const headers = await getAuthHeaders(user);
  
  const response = await fetch(`${API_BASE_URL}/reports/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Upload failed");
  }

  return data.data; // Backend returns { success: true, data: {...}, message: "..." }
}

/**
 * Get list of all reports for the current user
 */
export async function getReports(user) {
  const response = await authenticatedFetch("/reports", { method: "GET" }, user);
  return response.data; // Backend returns { success: true, data: [...] }
}

/**
 * Get report summary by name and type
 * @param {string} reportName - Name of the report
 * @param {string} reportType - Type of the report
 */
export async function getReportSummary(reportName, reportType, user) {
  const params = new URLSearchParams({
    name: reportName,
    type: reportType,
  });

  const response = await authenticatedFetch(
    `/reports/summary?${params.toString()}`,
    { method: "GET" },
    user
  );
  
  return response.data;
}

// ==================== COMPARISON ROUTES ====================

/**
 * Compare two reports
 * @param {Object} params - Comparison parameters
 * @param {string} params.oldReportName - Name of the old report
 * @param {string} params.oldReportType - Type of the old report
 * @param {string} params.newReportName - Name of the new report (if using existing)
 * @param {string} params.newReportType - Type of the new report
 * @param {File} params.file - New file to upload and compare (optional)
 * @param {string} params.language - Language code (default: "en")
 */
export async function compareReports(params, user) {
  const { oldReportName, oldReportType, newReportName, newReportType, file, language = "en" } = params;

  const formData = new FormData();
  formData.append("oldReportName", oldReportName);
  formData.append("oldReportType", oldReportType);
  formData.append("language", language);

  if (file) {
    // Case 1: Upload new file
    formData.append("file", file);
    formData.append("newReportType", newReportType);
  } else {
    // Case 2: Use existing report
    formData.append("newReportName", newReportName);
    formData.append("newReportType", newReportType);
  }

  const headers = await getAuthHeaders(user);
  
  const response = await fetch(`${API_BASE_URL}/comparisons`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Comparison failed");
  }

  return data.data;
}

/**
 * Get existing comparison
 */
export async function getComparison(oldName, oldType, newName, newType, user) {
  const params = new URLSearchParams({
    old: oldName,
    oldType: oldType,
    new: newName,
    newType: newType,
  });

  const response = await authenticatedFetch(
    `/comparisons?${params.toString()}`,
    { method: "GET" },
    user
  );
  
  return response.data;
}

// ==================== CHATBOT ROUTES ====================

/**
 * Create or get a chat session for a report
 * @param {string} reportName - Name of the report
 * @param {string} reportType - Type of the report
 */
export async function createChatSession(reportName, reportType,  language, user) {
  const response = await authenticatedFetch(
    "/chatbot/session",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportName,
        reportType,
         language, 
      }),
    },
    user
  );
  
  return response.data;
}

/**
 * Get a chat session by ID
 * @param {string} sessionId - Session ID
 */
export async function getChatSession(sessionId, user) {
  const response = await authenticatedFetch(
    `/chatbot/session/${sessionId}`,
    { method: "GET" },
    user
  );
  
  return response.data;
}

/**
 * Send a message to the chatbot
 * @param {string} sessionId - Session ID
 * @param {string} message - User's message
 * @param {string} language
 */
export async function sendChatMessage(sessionId, message, language,user) {
  const response = await authenticatedFetch(
    "/chatbot/message",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        message,
        language
      }),
    },
    user
  );
  
  return response.data;
}

// ==================== HEALTH ROUTES ====================

/**
 * Check backend health
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.text();
}
