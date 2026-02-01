'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  isTyping: boolean;
  setIsTyping: (v: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    // Add user message
    addMessage('user', content.trim());
    setIsTyping(true);

    try {
      // Build message history for API
      const apiMessages = messages
        .concat({ id: 'temp', role: 'user', content: content.trim(), timestamp: new Date() })
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

      addMessage('assistant', data.message);
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('assistant', "I'm having trouble connecting right now. Please try again!");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, isTyping, setIsTyping, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
