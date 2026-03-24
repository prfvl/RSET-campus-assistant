import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Menu, X, Plus, 
  MessageSquare, GraduationCap, 
  MapPin, Clock, HelpCircle, User, Loader2,
  Calendar, Bell, CalendarPlus, CheckCircle2
} from 'lucide-react';
import './App.css';

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'bot',
    text: "Welcome to RSET Campus Assistant. I can help answer queries about admissions, courses, faculty, schedules, and campus life. How may I assist you today?",
    timestamp: new Date().toISOString()
  }
];

const SUGGESTIONS = [
  "What programs does CSE offer?",
  "What is the attendance requirement?",
  "Show my schedule",
  "How to apply for revaluation?",
  "Career opportunities in CSE"
];

function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [chatHistory, setChatHistory] = useState([
    { id: 'h1', title: 'Admissions 2024' },
    { id: 'h2', title: 'CSE Department Info' },
  ]);

  // Schedule state
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' });
  const [addingEvent, setAddingEvent] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Notification state
  const [notifForm, setNotifForm] = useState({ email: '', event: '', date: '', time: '' });
  const [notifSending, setNotifSending] = useState(false);
  const [notifLog, setNotifLog] = useState([]);
  
  const bottomRef = useRef(null);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch schedule events when tab changes to schedule
  useEffect(() => {
    if (activeTab === 'schedule') {
      fetchEvents();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const res = await fetch('/api/schedule');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;
    setAddingEvent(true);
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      if (res.ok) {
        const created = await res.json();
        setEvents(prev => [...prev, created]);
        setNewEvent({ title: '', date: '', time: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Failed to add event:', err);
    } finally {
      setAddingEvent(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifForm.email || !notifForm.event || !notifForm.date || !notifForm.time) return;
    setNotifSending(true);
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifForm)
      });
      if (res.ok) {
        const data = await res.json();
        setNotifLog(prev => [{ ...notifForm, message: data.message, id: Date.now() }, ...prev]);
        setNotifForm({ email: '', event: '', date: '', time: '' });
      }
    } catch (err) {
      console.error('Failed to send notification:', err);
    } finally {
      setNotifSending(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();

    // Add User Message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: userText,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator
    const typingMsg = {
      id: Date.now() + 1,
      type: 'bot',
      text: '',
      isTyping: true,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, typingMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      // Replace typing indicator with actual response
      setMessages(prev => prev.map(m => 
        m.isTyping 
          ? { ...m, text: data.reply, isTyping: false } 
          : m
      ));
    } catch (err) {
      // Replace typing indicator with error message
      setMessages(prev => prev.map(m => 
        m.isTyping 
          ? { ...m, text: `Sorry, I couldn't connect to the server. Please make sure the backend is running.\n\nError: ${err.message}`, isTyping: false } 
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <div className="app-container">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 15
          }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar flex-col ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="college-logo-combo">
            <div className="icon-wrapper">
              <GraduationCap size={20} strokeWidth={2.5} />
            </div>
            <span>RSET Assistant</span>
          </div>
        </div>
        
        <button className="new-chat-btn" onClick={() => { setMessages(INITIAL_MESSAGES); setIsLoading(false); setActiveTab('chat'); }}>
          <Plus size={18} />
          New Chat
        </button>

        <div className="sidebar-content">
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
            Recent Activity
          </p>
          {chatHistory.map((chat) => (
            <div key={chat.id} className="history-item">
              <MessageSquare size={16} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {chat.title}
              </span>
            </div>
          ))}
        </div>
        
        <div className="sidebar-footer" style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} />
            </div>
            <span style={{ fontSize: '0.875rem' }}>Guest User</span>
        </div>
      </aside>

      {/* Main Area */}
      <main className="main-chat">
        {/* Header */}
        <header className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={toggleSidebar} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}
              className="mobile-menu-btn"
            >
              <Menu size={24} />
            </button>
            <div className="status-indicator">
              <div className="status-dot animate-pulse"></div>
              <span>Systems Online</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><HelpCircle size={20} /></button>
          </div>
        </header>

        {/* Tab Bar */}
        <div className="tab-bar">
          <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
            <MessageSquare size={16} />
            <span>Chat</span>
          </button>
          <button className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
            <Calendar size={16} />
            <span>Schedule</span>
          </button>
          <button className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            <Bell size={16} />
            <span>Notifications</span>
          </button>
        </div>

        {/* ── Chat Panel ── */}
        {activeTab === 'chat' && (
          <>
            <div className="chat-window">
              {messages.length === 1 && (
                 <div className="suggestions animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {SUGGESTIONS.map((suggestion, idx) => (
                      <button 
                        key={idx} 
                        className="suggestion-chip"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                 </div>
              )}
              
              {messages.map((msg, index) => (
                <div 
                  key={msg.id} 
                  className={`message-wrapper ${msg.type} animate-fade-in`}
                  style={{ animationDelay: `${Math.min(index * 0.1, 0.5)}s` }}
                >
                  <div className="message-bubble">
                    {msg.isTyping ? (
                      <div className="typing-indicator">
                        <Loader2 size={18} className="spin" />
                        <span>Thinking...</span>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Form */}
            <div className="input-area">
              <form 
                className="input-container" 
                onSubmit={handleSendMessage}
              >
                <textarea
                  className="chat-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about the college..."
                  rows={1}
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="send-btn"
                  disabled={!inputValue.trim() || isLoading}
                >
                  {isLoading ? <Loader2 size={18} className="spin" /> : <Send size={18} strokeWidth={2.5}/>}
                </button>
              </form>
              <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                AI Assistant may produce inaccurate information about campus rules. Double-check official documentation.
              </div>
            </div>
          </>
        )}

        {/* ── Schedule Panel ── */}
        {activeTab === 'schedule' && (
          <div className="schedule-panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Campus Schedule</h2>
                <p className="panel-subtitle">Upcoming events and deadlines</p>
              </div>
              <button className="add-event-toggle" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? <X size={18} /> : <CalendarPlus size={18} />}
                {showAddForm ? 'Cancel' : 'Add Event'}
              </button>
            </div>

            {showAddForm && (
              <form className="add-event-form animate-fade-in" onSubmit={handleAddEvent}>
                <input
                  type="text"
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="form-input"
                  required
                />
                <div className="form-row">
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="form-input"
                    required
                  />
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <button type="submit" className="form-submit-btn" disabled={addingEvent}>
                  {addingEvent ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
                  {addingEvent ? 'Adding...' : 'Add Event'}
                </button>
              </form>
            )}

            {eventsLoading ? (
              <div className="panel-loading">
                <Loader2 size={24} className="spin" />
                <span>Loading schedule...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="panel-empty">
                <Calendar size={40} strokeWidth={1} />
                <p>No events scheduled yet.</p>
              </div>
            ) : (
              <div className="events-grid">
                {events.map((event, idx) => (
                  <div key={idx} className="event-card animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="event-accent"></div>
                    <div className="event-body">
                      <h3 className="event-title">{event.title}</h3>
                      <div className="event-meta">
                        <span className="event-date">
                          <Calendar size={14} />
                          {formatDate(event.date)}
                        </span>
                        <span className="event-time">
                          <Clock size={14} />
                          {formatTime(event.time)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Notifications Panel ── */}
        {activeTab === 'notifications' && (
          <div className="notification-panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Notifications</h2>
                <p className="panel-subtitle">Send reminders and alerts</p>
              </div>
            </div>

            <form className="notif-form animate-fade-in" onSubmit={handleSendNotification}>
              <div className="form-group">
                <label className="form-label">Recipient Email</label>
                <input
                  type="email"
                  placeholder="student@rajagiri.edu.in"
                  value={notifForm.email}
                  onChange={e => setNotifForm({ ...notifForm, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Event Name</label>
                <input
                  type="text"
                  placeholder="e.g. Assignment Deadline"
                  value={notifForm.event}
                  onChange={e => setNotifForm({ ...notifForm, event: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={notifForm.date}
                    onChange={e => setNotifForm({ ...notifForm, date: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    value={notifForm.time}
                    onChange={e => setNotifForm({ ...notifForm, time: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="form-submit-btn" disabled={notifSending}>
                {notifSending ? <Loader2 size={16} className="spin" /> : <Bell size={16} />}
                {notifSending ? 'Sending...' : 'Send Notification'}
              </button>
            </form>

            {notifLog.length > 0 && (
              <div className="notif-log animate-fade-in">
                <p className="notif-log-title">Sent Notifications</p>
                {notifLog.map(n => (
                  <div key={n.id} className="notif-log-item">
                    <CheckCircle2 size={16} className="notif-check" />
                    <div>
                      <p className="notif-log-event">{n.event}</p>
                      <p className="notif-log-detail">To {n.email} · {n.date} at {n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
