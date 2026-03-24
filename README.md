# RSET Campus Assistant

An AI-powered campus assistant for Rajagiri School of Engineering and Technology (RSET). Students can ask questions about admissions, courses, schedules, and more through a chat interface.

## Architecture

- **Frontend** (`frontend/`): React + Vite chat interface
- **Backend** (`backend/`): FastAPI server with LangChain multi-agent system
  - **RAG Agent**: Answers questions using FAISS vector database + TinyLlama LLM
  - **Schedule Agent**: Returns upcoming events from JSON schedule
  - **Notification Agent**: Sends reminders/alerts
  - **Router Agent**: Routes questions to the correct agent (keyword matching + LLM fallback)

## Quick Start

### Prerequisites

- **Node.js** v18+ (for frontend)
- **Python** 3.10+ (for backend)
- **Ollama** with `tinyllama` model pulled (`ollama pull tinyllama`)

### 1. Build the Vector Database

```bash
cd backend
pip install -r requirements.txt
python rag/build_vector_db.py
```

### 2. Start the Backend

```bash
cd backend
uvicorn server:app --reload --port 8000
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Team

| Member | Component |
|--------|-----------|
| Member 1 | Chatbot Interface (Frontend) |
| Member 2 | RAG Query System |
| Member 3 | Data Preparation |
| Member 4 | Schedule System |
| Member 5 | Notification System |
| Member 6 | Multi-Agent Router |
| Member 7 | Backend Integration + Deployment |
