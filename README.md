# MedExplain

## Introduction

MedExplain is an open-source platform designed to improve medical information accessibility. It empowers users to upload, analyze, and interpret medical documents using advanced AI models. The application aims to bridge the knowledge gap for non-medical users by providing clear, context-aware explanations for complex medical content.

## Features

- AI-powered extraction and summarization of medical documents
- Support for multiple document types (PDF, DOCX, images)
- Clear explanations of medical terms and concepts
- Per-document chatbot that answers questions using context retrieval from each uploaded PDF
- RESTful API for programmatic access
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

### API Routes Overview

The backend exposes RESTful routes that support authentication, document management, and per-document chat. All routes below assume a base URL of `http://localhost:8000`. Use an `Authorization: Bearer <token>` header for protected endpoints after successful login. The following subsections describe each route and include full request and response examples.

#### POST /api/auth/signup

This endpoint creates a new user account and initializes the corresponding Firebase user document.

```api
{
  "title": "User Signup",
  "description": "Register a new MedExplain user account.",
  "method": "POST",
  "baseUrl": "http://localhost:8000",
  "endpoint": "/api/auth/signup",
  "headers": [
    {
      "key": "Content-Type",
      "value": "application/json",
      "required": true"
    }
  ],
  "queryParams": [],
  "pathParams": [],
  "bodyType": "json",
  "requestBody": "{\n  \"name\": \"Jane Doe\",\n  \"email\": \"jane@example.com\",\n  \"password\": \"StrongPass123\"\n}",
  "formData": [],
  "responses": {
    "201": {
      "description": "User created successfully",
      "body": "{\n  \"data\": {\n    \"uid\": \"firebase-uid-123\",\n    \"name\": \"Jane Doe\",\n    \"email\": \"jane@example.com\"\n  }\n}"
    },
    "400": {
      "description": "Validation error",
      "body": "{\n  \"error\": {\n    \"message\": \"Email already in use\"\n  }\n}"
    }
  }
}
```

#### POST /api/auth/login

This endpoint authenticates a user and returns a JWT token for subsequent requests.

```api
{
  "title": "User Login",
  "description": "Authenticate an existing MedExplain user.",
  "method": "POST",
  "baseUrl": "http://localhost:8000",
  "endpoint": "/api/auth/login",
  "headers": [
    {
      "key": "Content-Type",
      "value": "application/json",
      "required": true
    }
  ],
  "queryParams": [],
  "pathParams": [],
  "bodyType": "json",
  "requestBody": "{\n  \"email\": \"jane@example.com\",\n  \"password\": \"StrongPass123\"\n}",
  "formData": [],
  "responses": {
    "200": {
      "description": "Login successful",
      "body": "{\n  \"data\": {\n    \"token\": \"jwt-token-value\",\n    \"user\": {\n      \"uid\": \"firebase-uid-123\",\n      \"name\": \"Jane Doe\",\n      \"email\": \"jane@example.com\"\n    }\n  }\n}"
    },
    "401": {
      "description": "Invalid credentials",
      "body": "{\n  \"error\": {\n    \"message\": \"Invalid email or password\"\n  }\n}"
    }
  }
}
```

#### POST /api/documents

This endpoint uploads a new medical document, triggers processing, and initializes per-PDF chatbot context.

```api
{
  "title": "Upload Document",
  "description": "Upload a medical document and start background processing.",
  "method": "POST",
  "baseUrl": "http://localhost:8000",
  "endpoint": "/api/documents",
  "headers": [
    {
      "key": "Authorization",
      "value": "Bearer <token>",
      "required": true
    }
  ],
  "queryParams": [],
  "pathParams": [],
  "bodyType": "form",
  "requestBody": "",
  "formData": [
    {
      "key": "file",
      "value": "PDF or DOCX file content",
      "required": true
    },
    {
      "key": "title",
      "value": "Human friendly document title",
      "required": false
    }
  ],
  "responses": {
    "201": {
      "description": "Document uploaded successfully",
      "body": "{\n  \"data\": {\n    \"id\": \"doc-id-123\",\n    \"title\": \"MRI Report\",\n    \"status\": \"processing\"\n  }\n}"
    },
    "400": {
      "description": "Invalid file",
      "body": "{\n  \"error\": {\n    \"message\": \"Unsupported file type\"\n  }\n}"
    }
  }
}
```

#### GET /api/documents

This endpoint lists all documents for the authenticated user with pagination support.

```api
{
  "title": "List Documents",
  "description": "Retrieve a paginated list of user documents.",
  "method": "GET",
  "baseUrl": "http://localhost:8000",
  "endpoint": "/api/documents",
  "headers": [
    {
      "key": "Authorization",
      "value": "Bearer <token>",
      "required": true
    }
  ],
  "queryParams": [
    {
      "key": "page",
      "value": "Page number starting from 1",
      "required": false
    },
    {
      "key": "pageSize",
      "value": "Number of items per page",
      "required": false
    }
  ],
  "pathParams": [],
  "bodyType": "none",
  "requestBody": "",
  "formData": [],
  "responses": {
    "200": {
      "description": "List of documents",
      "body": "{\n  \"data\": {\n    \"items\": [\n      {\n        \"id\": \"doc-id-123\",\n        \"title\": \"MRI Report\",\n        \"status\": \"ready\"\n      }\n    ],\n    \"page\": 1,\n    \"pageSize\": 10,\n    \"total\": 1\n  }\n}"
    },
    "401": {
      "description": "Unauthorized",
      "body": "{\n  \"error\": {\n    \"message\": \"Missing or invalid token\"\n  }\n}"
    }
  }
}
```

#### GET /api/documents/id

This endpoint retrieves metadata and processing status for a specific document.

```api
{
  "title": "Get Document Detail",
  "description": "Fetch a single document's metadata by id.",
  "method": "GET",
  "baseUrl": "http://localhost:8000",
  "endpoint": "/api/documents/{id}",
  "headers": [
    {
      "key": "Authorization",
      "value": "Bearer <token>",
      "required": true
    }
  ],
  "queryParams": [],
  "pathParams": [
    {
      "key": "id",
      "value": "Identifier of the document",
      "required": true
    }
  ],
  "bodyType": "none",
  "requestBody": "",
  "formData": [],
  "responses": {
    "200": {
      "description": "Document found",
      "body": "{\n  \"data\": {\n    \"id\": \"doc-id-123\",\n    \"title\": \"MRI Report\",\n    \"status\": \"ready\",\n    \"pageCount\": 6,\n    \"createdAt\": \"2024-01-01T10:00:00Z\"\n  }\n}"
    },
    "404": {
      "description": "Not found",
      "body": "{\n  \"error\": {\n    \"message\": \"Document not found\"\n  }\n}"
    }
  }
}
```

#### DELETE /api/documents/id

This endpoint deletes a document and its associated chunks, conversations, and messages.

```api
{
  "title": "Delete Document",
  "description": "Delete a document and all related chatbot data.",
  "method": "DELETE",
  "baseUrl": "http://localhost:8000",
  "endpoint": "/api/documents/{id}",
  "headers": [
    {
      "key": "Authorization",
      "value": "Bearer <token>",
      "required": true
    }
  ],
  "queryParams": [],
  "pathParams": [
    {
      "key": "id",
      "value": "Identifier of the document",
      "required": true
    }
  ],
  "bodyType": "none",
  "requestBody": "",
  "formData": [],
  "responses": {
    "200": {
      "description": "Document deleted",
      "body": "{\n  \"data\": {\n    \"id\": \"doc-id-123\",\n    \"deleted\": true\n  }\n}"
    },
    "404": {
      "description": "Not found",
      "body": "{\n  \"error\": {\n    \"message\": \"Document not found\"\n  }\n}"
    }
  }
}
```

#### POST /api/documents/id/chat

This endpoint sends a user question to the per-document chatbot using context retrieval over that PDF.

```api
{
  "title": "Ask Document Chatbot",
  "description": "Send a question to the chatbot scoped to a specific document.",
  "method": "POST",
  "baseUrl": "http://localhost:8000",
  "endpoint": "/api/documents/{id}/chat",
  "headers": [
    {
      "key": "Authorization",
      "value": "Bearer <token>",
      "required": true
    },
    {
      "key": "Content-Type",
      "value": "application/json",
      "required": true
    }
  ],
  "queryParams": [],
  "pathParams": [
    {
      "key": "id",
      "value": "Identifier of the document",
      "required": true
    }
  ],
  "bodyType": "json",
  "requestBody": "{\n  \"question\": \"What is the main diagnosis in this report?\",\n  \"conversationId\": \"conv-id-123\"\n}",
  "formData": [],
  "responses": {
    "200": {
      "description": "Chat response generated",
      "body": "{\n  \"data\": {\n    \"conversationId\": \"conv-id-123\",\n    \"answer\": \"The main diagnosis is a left temporal lobe glioma.\",\n    \"contextChunks\": [\n      {\n        \"chunkId\": \"chunk-1\",\n        \"pageNumber\": 2\n      }\n    ]\n  }\n}"
    },
    "409": {
      "description": "Document not ready",
      "body": "{\n  \"error\": {\n    \"message\": \"Document still processing, try again later\"\n  }\n}"
    }
  }
}
```

#### GET /api/documents/id/messages

This endpoint retrieves the full message history for a document conversation.

```api
{
  "title": "List Chat Messages",
  "description": "Get message history for a document chatbot conversation.",
  "method": "GET",
  "baseUrl": "http://localhost:8000",
  "endpoint": "/api/documents/{id}/messages",
  "headers": [
    {
      "key": "Authorization",
      "value": "Bearer <token>",
      "required": true
    }
  ],
  "queryParams": [
    {
      "key": "conversationId",
      "value": "Identifier of the conversation",
      "required": true
    }
  ],
  "pathParams": [
    {
      "key": "id",
      "value": "Identifier of the document",
      "required": true
    }
  ],
  "bodyType": "none",
  "requestBody": "",
  "formData": [],
  "responses": {
    "200": {
      "description": "Messages retrieved",
      "body": "{\n  \"data\": {\n    \"conversationId\": \"conv-id-123\",\n    \"messages\": [\n      {\n        \"id\": \"msg-1\",\n        \"role\": \"user\",\n        \"content\": \"What is the diagnosis?\",\n        \"createdAt\": \"2024-01-01T10:00:00Z\"\n      },\n      {\n        \"id\": \"msg-2\",\n        \"role\": \"assistant\",\n        \"content\": \"The diagnosis is a left temporal lobe glioma.\",\n        \"createdAt\": \"2024-01-01T10:00:03Z\"\n      }\n    ]\n  }\n}"
    },
    "404": {
      "description": "Conversation not found",
      "body": "{\n  \"error\": {\n    \"message\": \"Conversation not found for this document\"\n  }\n}"
    }
  }
}
```

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

Example `.env`:
```bash
DATABASE_URL=mongodb://localhost:27017/medexplain
SECRET_KEY=your-secret-key
AI_API_KEY=your-ai-api-key
FRONTEND_URL=http://localhost:3000
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_DATABASE_URL=https://your-firebase-project-id.firebaseio.com
```

### Firebase Configuration and Collections

MedExplain uses Firebase for authentication state and persistent storage of user, document, and chat metadata. The backend typically uses the Firebase Admin SDK, while the frontend uses the client SDK. Firestore acts as the main document store for multi-tenant chatbot context. Each collection is designed to support fast per-PDF retrieval and secure access control.

#### Firebase Project Setup

- Create a Firebase project and enable Firestore in native mode.
- Generate a service account key and map its values to the environment variables above.
- Enable Firebase Authentication and select the providers you need.
- Restrict API keys and configure security rules aligned with user-based access.

#### Authentication Providers

- **Email and password:** Primary provider for user registration and login flows.
- **Google sign-in:** Optional provider for faster onboarding and single sign-on.
- Provider configuration remains in the Firebase console, while tokens are verified server-side.
- The backend validates Firebase ID tokens and maps them to internal user records.

#### Firestore Collections

The following collections store all MedExplain specific data in Firestore. Collection names use lowercase and plural form for consistency. Each document includes `createdAt` and `updatedAt` timestamps. All references use Firestore document IDs rather than embedded foreign keys.

##### users collection

The `users` collection stores user profiles linked to Firebase Authentication UIDs. Each document ID matches the Firebase `uid` of the user. Role information and feature flags live here to control access.

Example document:
```json
{
  "uid": "firebase-uid-123",
  "email": "jane@example.com",
  "name": "Jane Doe",
  "photoUrl": "https://example.com/avatar.png",
  "role": "user",
  "onboardingCompleted": true,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:05:00Z"
}
```

##### documents collection

The `documents` collection holds high-level metadata about each uploaded PDF or other file. Each document references the owning user by `ownerUid` and stores processing status. Status values usually include `uploaded`, `processing`, `ready`, and `failed`.

Example document:
```json
{
  "id": "doc-id-123",
  "ownerUid": "firebase-uid-123",
  "title": "MRI Brain Report",
  "originalFileName": "mri_report.pdf",
  "mimeType": "application/pdf",
  "pageCount": 6,
  "status": "ready",
  "errorMessage": null,
  "language": "en",
  "summary": "Short summary of the report generated by the model.",
  "createdAt": "2024-01-01T10:10:00Z",
  "updatedAt": "2024-01-01T10:12:30Z"
}
```

##### documentChunks collection

The `documentChunks` collection stores the split and embedded text segments for each PDF. Each chunk includes the source `documentId`, page number, and a sequential `chunkIndex`. Embeddings are either stored as a shortened numeric array or as a reference to an external vector store.

Example document:
```json
{
  "id": "chunk-1",
  "documentId": "doc-id-123",
  "ownerUid": "firebase-uid-123",
  "pageNumber": 2,
  "chunkIndex": 0,
  "text": "Detailed text content from a specific section of the MRI report.",
  "embedding": [0.0123, -0.0456, 0.0789],
  "tokenCount": 180,
  "createdAt": "2024-01-01T10:10:30Z",
  "updatedAt": "2024-01-01T10:10:30Z"
}
```

Common indexes for this collection:

- Composite index on `documentId` and `chunkIndex` for deterministic ordering.
- Simple index on `ownerUid` for multi-tenant isolation queries.
- Optional index on `pageNumber` for page-scoped retrieval.

##### conversations collection

The `conversations` collection tracks each chatbot conversation associated with a single PDF and user. Each conversation references a `documentId` and `ownerUid` and stores lightweight metadata. This layer lets users maintain multiple chat threads per document.

Example document:
```json
{
  "id": "conv-id-123",
  "documentId": "doc-id-123",
  "ownerUid": "firebase-uid-123",
  "title": "First discussion about MRI findings",
  "lastMessagePreview": "The main diagnosis is a left temporal lobe glioma.",
  "lastMessageAt": "2024-01-01T10:15:10Z",
  "createdAt": "2024-01-01T10:14:00Z",
  "updatedAt": "2024-01-01T10:15:10Z"
}
```

##### messages collection

The `messages` collection stores individual chat turns for all conversations. Each message references a `conversationId`, `documentId`, and `ownerUid`. The `role` field distinguishes between `user` and `assistant` messages, and `contextChunkIds` records which chunks the assistant used.

Example document:
```json
{
  "id": "msg-2",
  "conversationId": "conv-id-123",
  "documentId": "doc-id-123",
  "ownerUid": "firebase-uid-123",
  "role": "assistant",
  "content": "The main diagnosis is a left temporal lobe glioma.",
  "contextChunkIds": ["chunk-1", "chunk-4"],
  "latencyMs": 2800,
  "createdAt": "2024-01-01T10:15:10Z",
  "updatedAt": "2024-01-01T10:15:10Z"
}
```

Typical indexes for this collection:

- Composite index on `conversationId` and `createdAt` for chronological ordering.
- Simple index on `documentId` where document-scoped message queries are needed.

##### Security Rules and Access Control

- Each `users` document is readable and writable only by its owner or admins.
- `documents`, `documentChunks`, `conversations`, and `messages` are scoped by `ownerUid`.
- Firestore security rules validate that authenticated `uid` matches the stored `ownerUid`.
- The backend applies additional checks to prevent cross-tenant context retrieval.

## Contributing

We welcome contributions from the community! To contribute:

- Fork the repository and create your feature branch (`git checkout -b feature/your-feature`)
- Commit your changes and push to your fork (`git push origin feature/your-feature`)
- Create a pull request describing your changes
- Write clear commit messages and document your code
- Ensure all tests pass and maintain code quality
- Review open issues and join discussions

For major changes, please open an issue first to discuss what you would like to change.

---

Thank you for supporting MedExplain. Your contributions help make medical information more accessible to everyone!