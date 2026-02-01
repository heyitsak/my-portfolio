'use client';

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { siteConfig } from '@/app/data/content';
import Image from 'next/image';
import { useChat } from '@/app/context/ChatContext';

// Context to communicate between terminal input and typewriter
const TerminalContext = createContext<{
  isUserTyping: boolean;
  setIsUserTyping: (v: boolean) => void;
}>({ isUserTyping: false, setIsUserTyping: () => {} });

// One-time typewriter effect (doesn't loop)
function TypeOnce({ text, delay = 0, className = '', onComplete }: { text: string; delay?: number; className?: string; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsComplete(true);
          onComplete?.();
          clearInterval(interval);
        }
      }, 60);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [text, delay, onComplete]);

  useEffect(() => {
    if (!isComplete) {
      const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 530);
      return () => clearInterval(cursorInterval);
    }
  }, [isComplete]);

  return (
    <span className={className}>
      {displayText}
      {!isComplete && (
        <span className={`inline-block w-[2px] h-[1em] ml-0.5 align-middle bg-green-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
      )}
    </span>
  );
}

// Rotating words/phrases component - modern manifesting style
const ROTATING_PHRASES = [
  "building MVPs",
  "AI enthusiast",
  "automating workflows",
  "shipping fast",
  "solving problems",
  "thinking in systems",
  "crafting solutions",
  "turning ideas into reality",
];

function RotatingText({ delay = 0 }: { delay?: number }) {
  const { isUserTyping } = useContext(TerminalContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<'waiting' | 'typing' | 'paused' | 'deleting' | 'stopped'>('waiting');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentPhrase = ROTATING_PHRASES[currentIndex];

  // Stop animation when user starts typing
  useEffect(() => {
    if (isUserTyping && phase !== 'stopped') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase('stopped');
    }
  }, [isUserTyping, phase]);

  useEffect(() => {
    if (phase === 'stopped') return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (phase === 'waiting') {
      timeoutRef.current = setTimeout(() => setPhase('typing'), delay);
    } else if (phase === 'typing') {
      if (displayText.length < currentPhrase.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, 50);
      } else {
        timeoutRef.current = setTimeout(() => setPhase('paused'), 2000);
      }
    } else if (phase === 'paused') {
      timeoutRef.current = setTimeout(() => setPhase('deleting'), 0);
    } else if (phase === 'deleting') {
      if (displayText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30);
      } else {
        // Move to next phrase
        setCurrentIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
        setPhase('typing');
        setDisplayText('');
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, currentPhrase, delay, displayText, phase]);

  if (phase === 'stopped') {
    return <span className="text-indigo-400">{ROTATING_PHRASES[0]}</span>;
  }

  return (
    <span className="text-indigo-400 font-medium">
      {displayText}
      <span className="inline-block w-[2px] h-[1.1em] ml-0.5 align-middle bg-indigo-400 animate-pulse" />
    </span>
  );
}

// Main description with rotating text only
function HeroDescription({ delay = 0 }: { delay?: number }) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!started) return null;

  return <RotatingText delay={300} />;
}

// Suggested questions for the terminal
const SUGGESTED_QUESTIONS = [
  "What services do you offer?",
  "What's your experience?",
  "Are you available for work?",
  "How can I contact you?",
];

// Interactive terminal input with AI - uses shared chat context
function TerminalInput() {
  const { setIsUserTyping } = useContext(TerminalContext);
  const { messages, isTyping, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Blinking cursor for input
  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 530);
    return () => clearInterval(cursorInterval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value.length > 0) {
      setIsUserTyping(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const userInput = input.trim();
    setInput('');
    await sendMessage(userInput);
  };

  return (
    <div className="mt-5 pt-5 border-t border-white/10">
      {/* History from shared context */}
      {messages.length > 0 && (
        <div className="mb-4 space-y-2 max-h-40 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`text-sm ${msg.role === 'user' ? 'text-green-400' : 'text-theme-secondary'}`}>
              {msg.role === 'user' ? '$ ' : '→ '}{msg.content}
            </div>
          ))}
          {isTyping && (
            <div className="text-sm text-theme-muted flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              thinking...
            </div>
          )}
        </div>
      )}

      {/* Prominent Input Area */}
      <div
        className={`relative bg-white/5 rounded-lg border transition-all duration-300 ${
          isFocused ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-white/10'
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Hint label */}
        {!input && !isFocused && messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm text-indigo-400/80 animate-pulse">
              💬 Ask me anything...
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-3 p-3">
          <span className="text-green-400 text-sm font-bold">$</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onFocus={() => { setIsFocused(true); setIsUserTyping(true); }}
              onBlur={() => setIsFocused(false)}
              placeholder={messages.length > 0 || isFocused ? "Type your question..." : ""}
              disabled={isTyping}
              className="w-full bg-transparent text-sm text-theme focus:outline-none font-mono placeholder:text-theme-muted/40"
            />
            {/* Blinking cursor when empty and focused */}
            {isFocused && !input && (
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-green-400 transition-opacity ${
                  showCursor ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </div>
          {input && (
            <button
              type="submit"
              disabled={isTyping}
              className="px-3 py-1 text-xs bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30 transition-colors"
            >
              Send
            </button>
          )}
        </form>
      </div>

      {/* Suggested questions */}
      {messages.length === 0 && !isFocused && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-theme-muted/60 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsUserTyping(true);
                  sendMessage(q);
                }}
                className="px-3 py-1.5 text-xs bg-white/5 hover:bg-indigo-500/20 text-theme-secondary hover:text-indigo-400 rounded-full border border-white/10 hover:border-indigo-500/30 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Hero() {
  const [imageError, setImageError] = useState(false);
  const [showElements, setShowElements] = useState(false);
  const [commandComplete, setCommandComplete] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const initials = siteConfig.name.charAt(0).toUpperCase();

  useEffect(() => {
    const timer = setTimeout(() => setShowElements(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <TerminalContext.Provider value={{ isUserTyping, setIsUserTyping }}>
      <section className="min-h-screen flex flex-col justify-center relative -mt-14 pt-14">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
          <div
            className="absolute"
            style={{
              top: '20%',
              left: '10%',
              width: '80vw',
              height: '80vh',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.04) 30%, rgba(99, 102, 241, 0.01) 50%, transparent 70%)',
              filter: 'blur(60px)',
              transform: 'translate(-30%, -20%)',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: '10%',
              right: '10%',
              width: '70vw',
              height: '70vh',
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.10) 0%, rgba(168, 85, 247, 0.03) 35%, rgba(168, 85, 247, 0.01) 55%, transparent 75%)',
              filter: 'blur(80px)',
              transform: 'translate(20%, 20%)',
            }}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12 relative z-10">
          {/* Terminal Box */}
          <div className="flex-1 opacity-0 animate-hero-reveal [animation-delay:100ms]">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-2 text-xs text-theme-muted font-mono">akhil@dev ~ </span>
              </div>

              {/* Terminal Content */}
              <div className="p-5 md:p-6 font-mono">
                {showElements && (
                  <div className="space-y-4">
                    {/* Command: whoami */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">$</span>
                      <TypeOnce text="whoami" delay={300} className="text-theme" onComplete={() => setCommandComplete(true)} />
                    </div>

                    {/* Output */}
                    {commandComplete && (
                      <div className="space-y-3 opacity-0 animate-hero-reveal [animation-delay:200ms]">
                        {/* Name */}
                        <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-tight">
                          <span className="text-theme">Hello, I'm </span>
                          <span className="text-gradient">{siteConfig.name}</span>
                          <span className="ml-2 inline-block hover:animate-wave origin-[70%_70%] cursor-pointer">👋</span>
                        </div>

                        {/* Description with rotating text */}
                        <div className="flex items-start gap-2 text-sm md:text-base max-w-xl">
                          <span className="text-indigo-400 flex-shrink-0">&gt;</span>
                          <p className="leading-relaxed" style={{ letterSpacing: '-0.01em' }}>
                            <HeroDescription delay={400} />
                          </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3 pt-4">
                          <button
                            onClick={() => scrollToSection('contact')}
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all hover:-translate-y-0.5"
                          >
                            Get in touch →
                          </button>
                          <button
                            onClick={() => scrollToSection('work')}
                            className="px-5 py-2.5 text-theme-secondary text-sm font-medium border border-white/20 rounded-lg hover:border-indigo-500/50 hover:text-indigo-400 transition-all"
                          >
                            View my work
                          </button>
                        </div>

                        {/* Tech Stack - Minimal Code Style */}
                        <div className="pt-6 mt-2 border-t border-white/10">
                          <div className="font-mono text-xs text-theme-muted">
                            <span className="text-purple-400">const</span>{' '}
                            <span className="text-blue-400">techStack</span>{' '}
                            <span className="text-theme-muted">=</span>{' '}
                            <span className="text-yellow-400">[</span>
                          </div>
                          <div className="flex flex-wrap gap-x-1 gap-y-0.5 pl-4 mt-1 font-mono text-xs">
                            <span className="text-emerald-400">"React"</span><span className="text-theme-muted">,</span>
                            <span className="text-emerald-400">"Next.js"</span><span className="text-theme-muted">,</span>
                            <span className="text-emerald-400">"TypeScript"</span><span className="text-theme-muted">,</span>
                            <span className="text-emerald-400">"Node.js"</span><span className="text-theme-muted">,</span>
                            <span className="text-emerald-400">"Python"</span><span className="text-theme-muted">,</span>
                            <span className="text-emerald-400">"AWS"</span><span className="text-theme-muted">,</span>
                            <span className="text-emerald-400">"Docker"</span><span className="text-theme-muted">,</span>
                            <span className="text-emerald-400">"K8s"</span><span className="text-theme-muted">,</span>
                            <span className="text-emerald-400">"Red Hat"</span><span className="text-theme-muted">,</span>
                            <span className="text-emerald-400">"OpenStack"</span><span className="text-theme-muted">,</span>
                            <span className="text-emerald-400">"Nginx"</span><span className="text-theme-muted">,</span>
                            <span className="text-emerald-400">"CI/CD"</span><span className="text-theme-muted">,</span>
                            <span className="text-emerald-400">"PostgreSQL"</span>
                          </div>
                          <div className="font-mono text-xs text-yellow-400">];</div>
                        </div>
                      </div>
                    )}

                    {/* Interactive AI Terminal */}
                    {commandComplete && <TerminalInput />}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Picture - Larger size */}
          <div className="opacity-0 animate-hero-reveal [animation-delay:400ms] flex-shrink-0 flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
              <div className="relative p-1.5 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500">
                <div className="p-1 rounded-full bg-theme">
                  <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 rounded-full overflow-hidden bg-theme-secondary">
                    {!imageError ? (
                      <Image
                        src="/profile.gif"
                        alt={siteConfig.name}
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
                        <span className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white">{initials}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </TerminalContext.Provider>
  );
}
