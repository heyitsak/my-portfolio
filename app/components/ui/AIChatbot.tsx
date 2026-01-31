'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "Hi! I'm Akhil's AI assistant. I can help answer questions about his services, experience, and availability. How can I help you today?",
  timestamp: new Date(),
};

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonPosition, setButtonPosition] = useState({ bottom: 24, right: 24, scale: 1, rotate: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);
  const hasMounted = useRef(false);

  const scrollToBottom = () => {
    // Only scroll within the chat container, not the whole page
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Skip the initial mount to prevent page scroll
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    // Only auto-scroll when chat is open
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Move button across the screen as user scrolls - ALWAYS VISIBLE & MOVING
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercent = Math.min(currentScrollY / (documentHeight - windowHeight), 1);

      setIsScrolling(true);

      // Calculate scroll velocity for dynamic effects
      const scrollDelta = currentScrollY - lastScrollY.current;
      scrollVelocity.current = scrollDelta;

      // TRAVERSE across the screen:
      // At top (0%): bottom-right corner
      // At 25%: bottom-center-right
      // At 50%: middle-right side
      // At 75%: top-center-right
      // At 100%: top-right corner

      // Vertical: moves from bottom to top as you scroll down
      const minBottom = 24;
      const maxBottom = windowHeight - 100;
      const newBottom = minBottom + ((1 - scrollPercent) * (maxBottom - minBottom) * 0.7);

      // Horizontal: creates a wave/curve pattern as you scroll
      // Uses sine wave to create smooth left-right movement
      const baseRight = 24;
      const maxHorizontalMove = Math.min(windowHeight * 0.3, 200); // Up to 200px or 30% of viewport
      const wavePosition = Math.sin(scrollPercent * Math.PI * 2) * maxHorizontalMove;
      const newRight = baseRight + Math.max(0, wavePosition);

      // Add velocity-based wobble on top
      const velocityWobble = Math.min(Math.max(scrollDelta * 0.8, -30), 30);

      // Scale pulse effect during active scrolling
      const scaleEffect = 1 + Math.abs(scrollDelta) * 0.003;
      const clampedScale = Math.min(Math.max(scaleEffect, 1), 1.2);

      // Rotation effect based on scroll direction
      const rotateEffect = Math.min(Math.max(scrollDelta * 0.4, -20), 20);

      setButtonPosition({
        bottom: Math.max(minBottom, Math.min(newBottom, maxBottom)),
        right: Math.max(24, newRight + velocityWobble),
        scale: clampedScale,
        rotate: rotateEffect,
      });

      lastScrollY.current = currentScrollY;

      // Clear previous timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Settle to final position smoothly after scroll stops
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
        // Keep the wave position but remove wobble effects
        setButtonPosition(prev => ({
          ...prev,
          right: Math.max(24, baseRight + Math.max(0, wavePosition)),
          scale: 1,
          rotate: 0
        }));
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const apiMessages = messages
        .filter(m => m.id !== '1')
        .concat(userMessage)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to get response. Please try again.');

      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again, or feel free to reach out directly via the contact section below!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Button - Moves dramatically with scroll */}
      <div
        className={`fixed z-50 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          bottom: `${buttonPosition.bottom}px`,
          right: `${buttonPosition.right}px`,
          transform: `scale(${buttonPosition.scale}) rotate(${buttonPosition.rotate}deg)`,
          transition: isScrolling
            ? 'bottom 0.1s ease-out, right 0.08s ease-out, transform 0.1s ease-out, opacity 0.3s'
            : 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Pulsing attention ring */}
        <div
          className="absolute inset-0 rounded-full bg-indigo-500/40"
          style={{
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />

        <button
          onClick={() => setIsOpen(true)}
          className="relative p-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            boxShadow: '0 10px 40px -5px rgba(99, 102, 241, 0.6), 0 4px 20px -5px rgba(0, 0, 0, 0.3)',
          }}
          aria-label="Open AI chat"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {/* Online indicator */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-indigo-600"></span>
            </span>
          </div>
        </button>

        {/* Floating label - appears prominently during scroll */}
        <div
          className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-200 ${
            isScrolling ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-4 scale-90 pointer-events-none'
          }`}
        >
          <div className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-xl animate-pulse">
            💬 Chat with AI
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5 w-3 h-3 bg-purple-600 rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Chat Window - Fixed position */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-theme border border-theme rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-theme bg-theme-secondary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-semibold text-theme">AI Assistant</h3>
              <p className="text-xs text-theme-muted flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Powered by GPT-4
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
        <div ref={chatContainerRef} className="h-[350px] overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-md'
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

          <div ref={messagesEndRef} />
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
              className="flex-1 px-4 py-2 rounded-xl bg-theme-card border border-theme text-theme placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl transition-colors"
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
