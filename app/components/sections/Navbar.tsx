'use client';

import { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from '@/app/components/ui/ThemeProvider';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const ticking = useRef(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const sections = navLinks.map(link => link.href.slice(1));
          for (const section of [...sections].reverse()) {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              if (rect.top <= 150) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.getElementById(href.slice(1));
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-theme/80 backdrop-blur-xl py-3">
      <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 flex items-center justify-between">
        {/* Nav Links - Now on left */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className={`font-display relative text-sm font-semibold tracking-wide transition-colors ${
                activeSection === link.href.slice(1)
                  ? 'text-theme'
                  : 'text-theme-muted hover:text-theme'
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${
                  activeSection === link.href.slice(1) ? 'w-full' : 'w-0'
                }`}
              />
            </a>
          ))}
        </div>

        {/* Mobile: Hamburger on left */}
        <button
          className="md:hidden p-2 text-theme-muted hover:text-theme rounded-lg transition-colors"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Settings Dropdown - Right side */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 rounded-full bg-theme-card border border-theme hover:border-indigo-500/50 transition-all"
            aria-label="Settings"
          >
            <svg className="w-5 h-5 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-theme border border-theme rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Theme Toggle */}
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-sm text-theme-secondary font-medium">Theme</span>
                <ThemeToggle />
              </div>

              {/* Divider */}
              <div className="my-2 border-t border-theme" />

              {/* Links */}
              <a
                href="#contact"
                onClick={(e) => {
                  scrollToSection(e, '#contact');
                  setIsSettingsOpen(false);
                }}
                className="block px-4 py-2 text-sm text-theme-secondary hover:text-theme hover:bg-theme-card transition-colors"
              >
                Get in touch
              </a>

              {/* Dashboard Link */}
              <a
                href="/admin"
                className="block px-4 py-2 text-sm text-theme-secondary hover:text-indigo-400 hover:bg-theme-card transition-colors"
              >
                My Dashboard
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
