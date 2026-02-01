'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/app/context/ChatContext';

const INITIAL_MESSAGE = {
  id: 'welcome',
  role: 'assistant' as const,
  content: "Hi! I'm Akhil's AI assistant. I can help answer questions about his services, experience, and availability. How can I help you today?",
  timestamp: new Date(),
};

export function AIChatbot() {
  const { messages: sharedMessages, isTyping, sendMessage } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasMounted = useRef(false);

  // Combine welcome message with shared messages
  const messages = [INITIAL_MESSAGE, ...sharedMessages];

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (isOpen) {
      scrollToBottom();
    }
  }, [sharedMessages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Show popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!popupDismissed && !isOpen) {
        setShowPopup(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [popupDismissed, isOpen]);

  // Hide popup after 10 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleOpenChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
    setShowPopup(false);
    setPopupDismissed(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userInput = input.trim();
    setInput('');
    setError(null);

    try {
      await sendMessage(userInput);
    } catch {
      setError('Failed to get response. Please try again.');
    }
  };

  return (
    <>
      {/* Chat Button - Fixed bottom right */}
      <div
        className={`fixed z-50 right-4 md:right-6 bottom-4 md:bottom-6 transition-all duration-300 ${
          isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'
        }`}
      >
        {/* Glow effect */}
        <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-60 blur-xl animate-pulse" />

        {/* Pulsing ring */}
        <div
          className="absolute -inset-1 rounded-full border-2 border-indigo-400/50"
          style={{
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />

        {/* Main button */}
        <button
          onClick={handleOpenChat}
          className="relative p-4 md:p-5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            boxShadow: '0 10px 40px -5px rgba(99, 102, 241, 0.7), 0 4px 20px -5px rgba(147, 51, 234, 0.5)',
          }}
          aria-label="Open AI chat"
        >
          <div className="relative">
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {/* Online indicator */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
            </span>
            {/* Message count badge */}
            {sharedMessages.length > 0 && (
              <span className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {sharedMessages.length}
              </span>
            )}
          </div>
        </button>

        {/* Auto popup message - appears above button */}
        <div
          className={`absolute bottom-full mb-3 right-0 whitespace-nowrap transition-all duration-500 ${
            showPopup && !isOpen
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          <div
            className="px-4 py-3 bg-theme border border-theme rounded-xl shadow-2xl"
            style={{
              boxShadow: '0 10px 40px -5px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl flex-shrink-0">👋</span>
              <div>
                <p className="font-medium text-theme text-sm">
                  {sharedMessages.length > 0 ? 'Continue chatting?' : 'Need help?'}
                </p>
                <p className="text-xs text-theme-muted mt-1">
                  {sharedMessages.length > 0 ? `${sharedMessages.length} messages` : 'Chat with AI assistant'}
                </p>
              </div>
            </div>
            {/* Arrow pointing down */}
            <div className="absolute bottom-0 right-6 translate-y-1.5 w-3 h-3 bg-theme border-r border-b border-theme rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`fixed z-50 bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-[400px] max-w-[400px] bg-theme border border-theme rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          maxHeight: 'calc(100vh - 120px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-theme bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-semibold text-theme">AI Assistant</h3>
              <p className="text-xs text-theme-muted flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Online now
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-theme-card rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <svg className="w-5 h-5 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="h-[300px] md:h-[350px] overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md'
                    : 'bg-theme-card border border-theme text-theme rounded-bl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-theme-card border border-theme rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-theme-muted rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-theme-muted rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-theme-muted rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-theme">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isTyping}
              className="flex-1 px-4 py-3 rounded-xl bg-theme-card border border-theme text-theme placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:hover:from-indigo-600 disabled:hover:to-purple-600 text-white rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
