
# MedExplain  
**Medical Reports, Simplified.**

MedExplain is an advanced AI-powered healthcare intelligence platform that bridges the gap between complex medical diagnostics and patient understanding. By leveraging state-of-the-art Large Language Models (LLMs) and a unified, accessible design system, MedExplain transforms dense medical reports into clear, modular, visual, and actionable insights—making healthcare information understandable for everyone.

---

## Overview

Medical reports are typically written for clinicians, not patients. MedExplain addresses this gap by converting raw diagnostic data into structured explanations, visual summaries, and contextual guidance without offering diagnoses or prescriptions. The platform prioritizes clarity, safety, and accessibility while preserving medical accuracy.

---

## Key Features

### 1. Smart PDF Report Analysis
Upload medical reports in PDF format and receive a structured, easy-to-understand analysis.

**Capabilities**
- Modular insight blocks categorized by health systems (e.g., Blood Health, Liver Function).
- Clear status indicators: Positive, Warning, Negative, or Neutral.
- Patient-friendly explanations covering:
  - Purpose of the report
  - Key findings in simple language
  - Values within and outside reference ranges
  - General care notes derived strictly from the report
- Automatic extraction of numerical metrics with visual charts comparing values against reference ranges.

---

### 2. Clinical Report Comparison and Trends
Track health progression by comparing reports over time.

**Capabilities**
- Side-by-side comparison of baseline and follow-up reports.
- Visual trend analysis using bar charts for metrics such as hemoglobin, cholesterol, and glucose.
- Automated detection of improvement, deterioration, or stability.
- Overall health trajectory scoring based on report-to-report changes.

---

### 3. Interactive Body Guide
An educational visual layer for understanding how reports relate to the human body.

**Capabilities**
- Organ system explorer (heart, brain, liver, kidneys, etc.).
- Mapping of lab tests to relevant organ systems.
- Physician-curated descriptions and preventive health guidance for each system.

---

### 4. Professional Print-Ready Reports
Convert digital insights into doctor-ready documents.

**Capabilities**
- One-click print support for summary and comparison views.
- Automatic removal of UI elements for clean layouts.
- Branded MedExplain header and formatting suitable for clinical records and physical filing.

---

### 5. AI Medicine Decoder
Instantly understand prescribed or over-the-counter medicines.

**Capabilities**
- Search by medicine name.
- Structured explanation including:
  - Intended use
  - Recommended timing (e.g., before or after food)
  - Common side effects
- Prominent medical disclaimer encouraging physician consultation.

---

### 6. Context-Aware Medical Chatbot
Ask questions about uploaded reports safely and accurately.

**Capabilities**
- Answers grounded strictly in the uploaded medical report.
- No diagnosis or treatment recommendations.
- Designed purely for explanation, clarification, and education.

---

### 7. Multi-Language Support
Built for inclusivity and accessibility.

**Supported Languages**
- English  
- Hindi  
- Marathi  

All summaries, insight cards, and medicine explanations are fully localized.

---

### 8. Security and Privacy
- Secure report processing.
- Authenticated user accounts.
- Encrypted storage of user data and report history.

---

## Technology Stack

### Frontend
- React 19 (Vite)
- Tailwind CSS v4 with a custom premium teal design system
- Recharts for data visualization
- Lucide React for icons
- React Markdown with Remark GFM

### Backend
- Flask (Python)
- Google Gemini 1.5 Flash (`gemini-2.5-flash`) optimized for structured JSON output
- Firebase Firestore for authentication and data storage
- Custom PDF parsing and intelligent chunking pipeline

---

## Installation and Setup

### Prerequisites
- Node.js v18 or higher
- Python v3.8 or higher
- Google Gemini API key
- Firebase project with service account credentials

---

### 1. Clone the Repository
```bash
git clone https://github.com/Joshua16vinu/MedExplain.git
cd MedExplain

```
---

### 2. Backend Setup

```bash
cd Backend

python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

**Configuration**

1. Create a `.env` file inside the `Backend` directory.
2. Add the following:

   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   PORT=8080
   ```
3. Place `serviceAccountKey.json` in the `Backend/` directory.

**Start Backend**

```bash
python app.py
```

Backend runs at:

```
http://localhost:8080
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## Usage Guide

1. Register or log in to access secure report storage.
2. Upload a medical report:

   * Select report type.
   * Choose preferred language.
   * Upload PDF.
3. Review insights:

   * Summary cards for quick assessment.
   * Visual charts for numeric values.
4. Compare reports:

   * Select old and new reports.
   * Review clinical comparison and trend charts.
5. Use additional tools:

   * Medicine Decoder for drug information.
   * Symptom Checker for educational guidance.

---

## Disclaimer

MedExplain is an educational and informational tool only.

* It does not provide medical diagnoses or treatment recommendations.
* Always consult a qualified healthcare professional for medical decisions.
* Do not rely solely on this application for health-related actions.
* In emergencies, use the SOS feature to locate appropriate helplines.

---

**© 2026 MedExplain. Built by Blind Coders with ❤️**




