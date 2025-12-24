# MedExplain

## Introduction

MedExplain is an open-source platform designed to improve medical information accessibility. It empowers users to upload, analyze, and interpret medical documents using advanced AI models. The application aims to bridge the knowledge gap for non-medical users by providing clear, context-aware explanations for complex medical content.

## Features

- AI-powered extraction and summarization of medical documents
- Support for multiple document types (PDF, DOCX, images)
- Clear explanations of medical terms and concepts
- Per-document chatbot that answers questions using context retrieval from each uploaded PDF
- User-friendly web interface
- Role-based user authentication and permissions
- Document history and annotation
- Export results in various formats (TXT, PDF)

## Requirements

- Python 3.8 or higher
- pip (Python package manager)
- Node.js and npm (for frontend development)
- MongoDB (or compatible NoSQL database)
- Modern web browser (for UI)

## Installation

Follow these steps to set up MedExplain on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Joshua16vinu/MedExplain.git
   cd MedExplain
   ```

2. **Set up the backend:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values (database URL, secret keys, API keys).

4. **Run backend migrations (if any):**
   ```bash
   python manage.py migrate
   ```

5. **Set up the frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

6. **Start the backend server:**
   ```bash
   python manage.py runserver
   ```

7. **Start the frontend (development mode):**
   ```bash
   cd frontend
   npm start
   ```

## Usage

- **Web Interface:**  
  Open your browser and navigate to `http://localhost:3000`. Register or log in to start uploading and analyzing medical documents.
- **API Access:**  
  Use the API endpoints to programmatically upload documents, retrieve explanations, and manage your data.
- **Document Upload:**  
  Drag and drop files into the upload area or use the upload button. Supported formats include PDF, DOCX, and image files.
- **Explanation Retrieval:**  
  After processing, the platform displays extracted medical terms and their explanations. Use filtering options to focus on specific sections or terms.

### Chatbot Functionality Per PDF

The application provides a dedicated chatbot for each uploaded PDF, scoped strictly to that document. After upload and processing, the backend splits the PDF into chunks, generates embeddings, and stores them with references. When you ask a question, the system embeds the query, retrieves the most relevant chunks, and builds a context window for the model. The chatbot then answers using only that retrieved context, ensuring responses remain grounded in the selected PDF.


## Configuration

MedExplain can be configured using environment variables and config files:

- **Database Settings:**  
  Set the `DATABASE_URL` in your `.env` file.
- **Authentication:**  
  Configure JWT secrets, OAuth credentials, or other auth settings in `.env`.
- **API Keys:**  
  Insert keys for any integrated third-party services (e.g., AI model providers).
- **Frontend URLs:**  
  Adjust the allowed origins and CORS settings as needed.


---

Thank you for supporting MedExplain. Your contributions help make medical information more accessible to everyone!
