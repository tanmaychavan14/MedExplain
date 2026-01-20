# MedExplain

**Medical Reports, Simplified.**

MedExplain is an advanced, AI-powered platform designed to bridge the gap between complex medical diagnostics and patient understanding. By leveraging state-of-the-art Large Language Models (LLMs), MedExplain transforms dense medical reports into clear, modular, and visually engaging insights, making healthcare information accessible to everyone.

---

##  Key Features

### 1.  Smart PDF Report Analysis
Upload your medical reports (PDF format) and get instant, comprehensive analysis.
*   **Modular Insight Blocks**: Key findings are categorized (e.g., Blood Health, Liver Function) and visually tagged with status indicators (`Positive`, `Warning`, `Negative`, `Neutral`) for quick scanning.
*   **Detailed Explanations**: A patient-friendly summary that breaks down:
    *   What the report is about.
    *   Key findings in simple language.
    *   Values within and outside normal ranges.
    *   General care notes (based strictly on the report).
*   **Data Visualization**: key numerical metrics are automatically extracted and presented as visual charts, showing your values against standard reference ranges.

### 2.  Context-Aware Medical Chatbot
Have questions about your specific report?
*   **Report-Grounded Answers**: The chatbot is "grounded" in the context of your uploaded report. It answers questions *only* based on the provided data, ensuring relevant and safe responses.
*   **Safety First**: The AI is strictly instructed not to diagnose or prescribe, but rather to explain and clarify findings.

### 3.  Multi-Language Support
MedExplain is built for inclusivity.
*   **Languages**: Fully supports **English**, **Hindi**, and **Marathi**.
*   **Localized Summaries**: Get the entire analysis and insight cards in your preferred language.

### 4.  Integrated Medical Tools
*   **Medical Dictionary**: Instantly search for complex medical terms to get simple, jargon-free definitions.
*   **Symptom Checker**: Describe your symptoms to get educational insights on possible causes (with strict medical disclaimers).

### 5. Secure & Private
*   **Privacy Focused**: Reports are processed securely.
*   **Authentication**: User accounts allow for secure access to personal report history.

---

##  Technology Stack

### Frontend
*   **Framework**: React 19 (Vite)
*   **Styling**: Tailwind CSS v4 (Modern, responsive design)
*   **Icons**: Lucide React
*   **Charts**: Recharts
*   **Markdown Rendering**: React Markdown

### Backend
*   **Server**: Flask (Python)
*   **AI Model**: Google Gemini 1.5 Flash (`gemini-2.5-flash`)
*   **Database**: Firebase / Firestore (Identity & Data storage)
*   **PDF Processing**: Custom PDF parsing & chunking

---

##  Installation & Setup

Follow these steps to run MedExplain locally.

### Prerequisites
*   Node.js (v18+)
*   Python (v3.8+)
*   Google Gemini API Key
*   Firebase Project Credentials (`serviceAccountKey.json`)

### 1. Clone the Repository
```bash
git clone https://github.com/Joshua16vinu/MedExplain.git
cd MedExplain
```

### 2. Backend Setup
Navigate to the `Backend` directory and set up the Python environment.

```bash
cd Backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configuration:**
1.  Create a `.env` file in the `Backend` directory.
2.  Add your API Key:
    ```env
    GEMINI_API_KEY=your_google_gemini_api_key
    PORT=8080
    ```
3.  Place your Firebase `serviceAccountKey.json` file inside the `Backend/` directory.

**Start the Server:**
```bash
python app.py
```
The backend will run on `http://localhost:8080`.

### 3. Frontend Setup
Open a new terminal and navigate to the `frontend` directory.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The application will launch in your browser at `http://localhost:5173`.

---

##  Usage Guide

1.  **Login/Register**: Create an account to save your report history.
2.  **Upload**:
    *   Go to the "Upload Report" tab.
    *   Select your report type (CBC, Lipid Profile, Thyroid, etc.).
    *   Choose your simplified language (English, Hindi, Marathi).
    *   Drag & drop your PDF file.
3.  **View Analysis**:
    *   Wait a few seconds for the "Smart Analysis".
    *   Review the **Insight Cards** for a quick health snapshot.
    *   Read the **Detailed Summary** for in-depth understanding.
4.  **Ask the Chatbot**:
    *   Click "Chat with Report" (if available) or use the chat interface.
    *   Ask questions like "Is my hemoglobin low?" or "What does High Neutrophils mean?".

---

##  Disclaimer

**MedExplain is an educational tool.**
It uses Artificial Intelligence to explain medical data but **does NOT provide medical diagnoses**.
*   Always consult a qualified doctor for medical advice.
*   Do not make health decisions solely based on this application's output.
