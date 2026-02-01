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

                        {/* Tech Stack */}
                        <div className="pt-6 mt-2 border-t border-white/10">
                          <p className="text-xs text-theme-muted mb-3">Tech I work with</p>
                          <div className="flex flex-wrap gap-3">
                            {/* React */}
                            <div className="group relative">
                              <div className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all">
                                <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/>
                                  <path d="M12 21.35c-1.5 0-2.8-.2-3.9-.5-1.2-.4-2.1-.9-2.8-1.5-.6-.6-1-1.2-1-1.85 0-.65.4-1.25 1-1.85.7-.6 1.6-1.1 2.8-1.5 1.1-.3 2.4-.5 3.9-.5s2.8.2 3.9.5c1.2.4 2.1.9 2.8 1.5.6.6 1 1.2 1 1.85 0 .65-.4 1.25-1 1.85-.7.6-1.6 1.1-2.8 1.5-1.1.3-2.4.5-3.9.5Zm0-1.5c2.8 0 5.5-.7 6.5-1.85.3-.3.5-.6.5-.85 0-.25-.2-.55-.5-.85-1-1.15-3.7-1.85-6.5-1.85s-5.5.7-6.5 1.85c-.3.3-.5.6-.5.85 0 .25.2.55.5.85 1 1.15 3.7 1.85 6.5 1.85Z"/>
                                  <path d="M8.8 18.15c-.75-1.3-1.3-2.75-1.6-4.3-.35-1.65-.4-3.25-.15-4.75.25-1.4.7-2.55 1.35-3.4.6-.85 1.3-1.2 2.1-1.2.8 0 1.5.35 2.1 1.2.65.85 1.1 2 1.35 3.4.25 1.5.2 3.1-.15 4.75-.3 1.55-.85 3-1.6 4.3-.75 1.3-1.5 2.15-2.2 2.5-.3.15-.55.2-.8.2s-.5-.05-.8-.2c-.7-.35-1.45-1.2-2.2-2.5Zm1.3-.75c.5.85.95 1.45 1.35 1.7.15.1.25.1.35.1s.2 0 .35-.1c.4-.25.85-.85 1.35-1.7.65-1.1 1.1-2.4 1.4-3.8.3-1.45.35-2.85.1-4.15-.2-1.2-.55-2.15-1.05-2.85-.4-.55-.8-.8-1.15-.8-.35 0-.75.25-1.15.8-.5.7-.85 1.65-1.05 2.85-.25 1.3-.2 2.7.1 4.15.3 1.4.75 2.7 1.4 3.8Z"/>
                                  <path d="M15.2 18.15c.75-1.3 1.3-2.75 1.6-4.3.35-1.65.4-3.25.15-4.75-.25-1.4-.7-2.55-1.35-3.4-.6-.85-1.3-1.2-2.1-1.2-.8 0-1.5.35-2.1 1.2-.65.85-1.1 2-1.35 3.4-.25 1.5-.2 3.1.15 4.75.3 1.55.85 3 1.6 4.3.75 1.3 1.5 2.15 2.2 2.5.3.15.55.2.8.2s.5-.05.8-.2c.7-.35 1.45-1.2 2.2-2.5Zm-1.3-.75c-.5.85-.95 1.45-1.35 1.7-.15.1-.25.1-.35.1s-.2 0-.35-.1c-.4-.25-.85-.85-1.35-1.7-.65-1.1-1.1-2.4-1.4-3.8-.3-1.45-.35-2.85-.1-4.15.2-1.2.55-2.15 1.05-2.85.4-.55.8-.8 1.15-.8.35 0 .75.25 1.15.8.5.7.85 1.65 1.05 2.85.25 1.3.2 2.7-.1 4.15-.3 1.4-.75 2.7-1.4 3.8Z"/>
                                </svg>
                              </div>
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">React</span>
                            </div>
                            {/* Next.js */}
                            <div className="group relative">
                              <div className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/50 hover:bg-white/10 transition-all">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.572 0Zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054Z"/>
                                </svg>
                              </div>
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Next.js</span>
                            </div>
                            {/* TypeScript */}
                            <div className="group relative">
                              <div className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all">
                                <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
                                </svg>
                              </div>
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">TypeScript</span>
                            </div>
                            {/* Node.js */}
                            <div className="group relative">
                              <div className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 transition-all">
                                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.065-.037.151-.023.218.017l2.256 1.339a.29.29 0 0 0 .272 0l8.795-5.076a.277.277 0 0 0 .134-.238V6.921a.283.283 0 0 0-.137-.242l-8.791-5.072a.278.278 0 0 0-.271 0L3.075 6.68a.284.284 0 0 0-.139.241v10.15a.27.27 0 0 0 .139.235l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675a1.857 1.857 0 0 1-.922-1.604V6.921c0-.659.353-1.275.922-1.603l8.795-5.082c.557-.315 1.296-.315 1.848 0l8.794 5.082c.57.329.924.944.924 1.603v10.15a1.86 1.86 0 0 1-.924 1.604l-8.795 5.078c-.28.163-.6.247-.924.247zm2.722-6.984c-3.868 0-4.678-1.774-4.678-3.263 0-.142.113-.254.255-.254h1.136c.127 0 .233.092.253.216.172 1.161.686 1.746 3.034 1.746 1.867 0 2.661-.422 2.661-1.412 0-.571-.225-.995-3.128-1.28-2.426-.239-3.927-.776-3.927-2.717 0-1.79 1.509-2.858 4.04-2.858 2.842 0 4.244.986 4.422 3.102a.258.258 0 0 1-.064.19.256.256 0 0 1-.182.079h-1.143a.252.252 0 0 1-.246-.196c-.274-1.217-.94-1.607-2.787-1.607-2.053 0-2.292.715-2.292 1.251 0 .649.282.838 3.032 1.204 2.725.363 4.022.877 4.022 2.779 0 1.932-1.61 3.04-4.418 3.04z"/>
                                </svg>
                              </div>
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Node.js</span>
                            </div>
                            {/* Python */}
                            <div className="group relative">
                              <div className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all">
                                <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
                                </svg>
                              </div>
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Python</span>
                            </div>
                            {/* AWS */}
                            <div className="group relative">
                              <div className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all">
                                <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.264-.168.312a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.385.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"/>
                                </svg>
                              </div>
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">AWS</span>
                            </div>
                            {/* PostgreSQL */}
                            <div className="group relative">
                              <div className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-sky-500/50 hover:bg-sky-500/10 transition-all">
                                <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M23.56 14.95c-.29-.98-1.16-1.52-2.35-1.68-.4-.06-.79-.07-1.18-.04-.5.03-.98.11-1.47.2-.32-1.28-.64-2.54-1.13-3.73-.42-1.02-.93-2-1.59-2.87-.77-1.01-1.72-1.81-2.88-2.37-.42-.2-.85-.37-1.29-.51a7.65 7.65 0 0 0-2.87-.38c-1.53.09-2.88.62-4.04 1.56-1.12.91-1.91 2.07-2.4 3.42-.49 1.35-.6 2.77-.38 4.2.07.42.17.84.27 1.25-.2.02-.42.04-.64.08-.42.07-.82.17-1.21.33-.65.26-1.11.7-1.35 1.36-.15.41-.14.83.02 1.23.24.62.67 1.07 1.24 1.39.42.23.87.38 1.34.49.26.07.53.12.8.16-.03.32-.05.63-.04.95.03.58.14 1.14.36 1.67.36.89.92 1.62 1.68 2.2.7.53 1.48.9 2.34 1.09.54.12 1.09.17 1.65.14.51-.03 1.02-.12 1.52-.26.7-.2 1.35-.51 1.96-.92.66-.44 1.24-.97 1.75-1.58.52-.62.97-1.29 1.36-2 .5-.92.87-1.9 1.13-2.92.1-.4.17-.81.24-1.21.13-.02.26-.03.38-.05.65-.1 1.28-.26 1.87-.53.41-.19.8-.41 1.14-.71.35-.31.61-.67.76-1.11.14-.38.17-.76.08-1.14zM8.44 19.77c-.66.39-1.35.55-2.06.55-.8 0-1.52-.23-2.13-.74-.52-.44-.84-1-.96-1.66-.08-.42-.09-.85 0-1.27.1-.46.25-.9.46-1.31.19-.38.43-.73.72-1.05l.26-.3c.03.38.08.75.15 1.12.17.94.5 1.81 1.01 2.59.36.55.79 1.05 1.3 1.48.29.25.61.47.95.66-.24.32-.48.63-.7.93zm8.05-.5a9.4 9.4 0 0 1-2.46 3.09c-.87.74-1.82 1.29-2.9 1.6-.66.2-1.33.28-2.03.24-.96-.05-1.82-.36-2.56-.93-.7-.54-1.17-1.24-1.4-2.09-.13-.47-.16-.96-.1-1.45.07-.6.26-1.16.54-1.69.22-.42.5-.8.83-1.15.37-.39.78-.74 1.22-1.04.36.33.75.62 1.17.87.68.41 1.4.74 2.15.99.94.31 1.91.5 2.91.58.73.06 1.45.04 2.17-.07.12-.02.24-.04.35-.07-.04.4-.1.8-.18 1.2-.14.62-.3 1.23-.5 1.82-.09.28-.17.57-.21.1z"/>
                                </svg>
                              </div>
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">PostgreSQL</span>
                            </div>
                          </div>
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
