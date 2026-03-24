from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from router_agent import route_question
from schedule_service.schedule_manager import get_all_events, add_event
from notification_service import send_notification

app = FastAPI(title="RSET Campus Assistant API")

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ──────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

class EventOut(BaseModel):
    title: str
    date: str
    time: str

class EventIn(BaseModel):
    title: str
    date: str
    time: str

class NotifyRequest(BaseModel):
    email: str
    event: str
    date: str
    time: str


# ── Chat ─────────────────────────────────────────────

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Route a student question through the multi-agent system and return the answer."""
    try:
        answer = route_question(request.message)
        return ChatResponse(reply=answer)
    except Exception as e:
        return ChatResponse(reply=f"Sorry, something went wrong: {str(e)}")


# ── Schedule ─────────────────────────────────────────

@app.get("/api/schedule", response_model=List[EventOut])
async def list_schedule():
    """Return all scheduled events."""
    return get_all_events()


@app.post("/api/schedule", response_model=EventOut)
async def create_event(event: EventIn):
    """Add a new event to the schedule."""
    new = add_event(event.title, event.date, event.time)
    return new


# ── Notifications ────────────────────────────────────

@app.post("/api/notify")
async def notify(req: NotifyRequest):
    """Send a notification and return confirmation."""
    send_notification(req.email, req.event, req.date, req.time)
    return {
        "status": "sent",
        "message": f"Notification sent to {req.email} for '{req.event}' on {req.date} at {req.time}"
    }


# ── Health ───────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok"}
