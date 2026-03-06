import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Menu, X, Plus, 
  MessageSquare, GraduationCap, 
  MapPin, Clock, HelpCircle, User 
} from 'lucide-react';
import './App.css';

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'bot',
    text: "Welcome to Apex College Assistant. I can help answer queries about admissions, courses, faculty, and campus life. How may I assist you today?",
    timestamp: new Date().toISOString()
  }
];

const SUGGESTIONS = [
  "Admissions Process",
  "Fee Structure",
  "Campus Virtual Tour",
  "Hostel Facilities",
  "Contact Info"
];

function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: 'h1', title: 'Admissions 2024' },
    { id: 'h2', title: 'CSE Department Info' },
  ]);
  
  const bottomRef = useRef(null);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    // Add User Message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: inputValue.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    
    // Simulate Bot Response
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: "I understand you're asking about that. Currently, this is a placeholder response in our static frontend.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMsg]);
    }, 800);
  };
  
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    // Optional: auto-submit immediately
    // handleSendMessage({ preventDefault: () => {} });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
            <span>Apex Admin</span>
          </div>
        </div>
        
        <button className="new-chat-btn" onClick={() => setMessages(INITIAL_MESSAGES)}>
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

      {/* Main Chat Area */}
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

        {/* Chat Messages */}
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
                {msg.text}
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
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={!inputValue.trim()}
            >
              <Send size={18} strokeWidth={2.5}/>
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            AI Assistant may produce inaccurate information about campus rules. Double-check official documentation.
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
