# MedExplain 

**Medical Reports, Simplified.**

MedExplain is an advanced, AI-powered platform designed to bridge the gap between complex medical diagnostics and patient understanding. By leveraging state-of-the-art Large Language Models (LLMs) and a unified, accessible design system, MedExplain transforms dense medical reports into clear, modular, visual, and actionable insights, making healthcare information accessible to everyone.

---

##  Key Features

### 1. Smart PDF Report Analysis
Upload your medical reports (PDF format) and get instant, comprehensive analysis.
*   **Modular Insight Blocks**: Key findings are categorized (e.g., Blood Health, Liver Function) and visually tagged with status indicators (`Positive`, `Warning`, `Negative`, `Neutral`) for quick scanning.
*   **Detailed Explanations**: A patient-friendly summary that breaks down:
    *   What the report is about.
    *   Key findings in simple language.
    *   Values within and outside normal ranges.
    *   General care notes (based strictly on the report).
*   **Data Visualization**: Key numerical metrics are automatically extracted from the report and plotted as charts, showing exactly where you stand against reference ranges.

### 2. Clinical Report Comparison & Trends
Track your health over time by comparing two different reports.
*   **Side-by-Side Analysis**: Compare an "Old Report" (Baseline) with a "New Report" (Follow-up) to see what has changed.
*   **visual Trend Charts**: A dedicated **Trend Analysis** section visualizes the changes in your vital metrics (e.g., Hemoglobin, Cholesterol) using interactive **Bar Charts**, comparing previous vs. current values.
*   **Progress Tracking**: The AI identifies if metrics have "Improved", "Worsened", or remained "Stable" and provides an overall health trajectory score.

### 3. AI Medicine Decoder
Don't know what a medicine is for?
*   **Instant Identification**: Type the name of any medicine (e.g., "Dolo 650") to get instant details.
*   **Structured Info**: Returns clearly defined breakdown:
    *   **Purpose**: What is it used for?
    *   **Best Time**: When to take it? (e.g., After food).
    *   **Side Effects**: Common things to watch out for.
*   **Safety**: Includes a prominent medical disclaimer urging user to consult doctors.

### 4. Context-Aware Medical Chatbot
Have questions about your specific report?
*   **Report-Grounded Answers**: The chatbot is "grounded" in the context of your uploaded report. It answers questions *only* based on the provided data, ensuring relevant and safe responses.
*   **Safety First**: The AI is strictly instructed not to diagnose or prescribe, but rather to explain and clarify findings.

### 5.  Multi-Language Support
MedExplain is built for inclusivity.
*   **Languages**: Fully supports **English**, **Hindi**, and **Marathi**.
*   **Localized Summaries**: Get the entire analysis, insight cards, and medicine details in your preferred language.

### 6.  Design System & Accessibility
*   **Unified Medical Design**: Built on a strict design token system ("Medical Teal" branding) for trust and calmness.
*   **Responsive**: Fully optimized for Mobile, Tablet, and Desktop.
*   **Accessible**: High contrast text, clear typography (Plus Jakarta Sans), and screen-reader friendly elements.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework**: React 19 (Vite)
*   **Styling**: Tailwind CSS v4 (Custom Design System with CSS Variables)
*   **Visualization**: Recharts (for dynamic trend plotting)
*   **Icons**: Lucide React
*   **Markdown**: React Markdown & Remark GFM

### Backend
*   **Server**: Flask (Python)
*   **AI Model**: Google Gemini 1.5 Flash (`gemini-2.5-flash`)
    *   *Optimized for JSON output mode for structured data.*
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

## 📖 Usage Guide

1.  **Login/Register**: Create an account to save your report history.
2.  **Upload**:
    *   Go to the "Upload Report" tab.
    *   Select your report type.
    *   Choose your simplified language (English, Hindi, Marathi).
    *   Drag & drop your PDF file.
3.  **View Analysis**:
    *   Review the **Insight Cards** for a quick health snapshot.
    *   See numerical charts for key values.
4.  **Compare Reports**:
    *   Switch to the **"Compare Reports"** tab.
    *   Select an old report on the left and a new report on the right.
    *   View the **Clinical Comparison** to see if your health is Improving, Stable, or Worsening.
    *   Check the **Trend Analysis Charts** to visually see the difference in values.
5.  **Tools**:
    *   Use the **Medicine Decoder** to identify pills.
    *   Use the **Symptom Checker** for educational guidance.

---

## Disclaimer

**MedExplain is an educational tool.**
It uses Artificial Intelligence to explain medical data but **does NOT provide medical diagnoses**.
*   Always consult a qualified doctor for medical advice.
*   Do not make health decisions solely based on this application's output.
*   **SOS**: In case of emergency, use the SOS button in the header to find helplines.

---
**© 2026 MedExplain. Built by Blind Coders with ❤️**
