'use client';

import { useState, useEffect, useRef } from 'react';
import { siteConfig } from '@/app/data/content';
import { ThemeToggle } from '@/app/components/ui/ThemeProvider';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - lastScrollY.current;

          // Calculate scroll progress
          const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (currentScrollY / documentHeight) * 100;
          setScrollProgress(progress);

          // Determine scroll direction with threshold
          if (Math.abs(scrollDelta) > 5) {
            const direction = scrollDelta > 0 ? 'down' : 'up';

            // Hide navbar when scrolling down past threshold, show when scrolling up
            if (currentScrollY > 100) {
              setIsVisible(direction === 'up');
            } else {
              setIsVisible(true);
            }
          }

          setScrolled(currentScrollY > 50);
          lastScrollY.current = currentScrollY;

          // Determine active section
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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.getElementById(href.slice(1));
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${
          scrolled
            ? 'bg-theme/90 backdrop-blur-xl border-b border-theme py-3'
            : 'bg-transparent py-6'
        } ${
          isVisible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        }`}
        style={{
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, padding 0.3s ease, background-color 0.3s ease',
        }}
      >
        {/* Scroll Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          {/* Logo / Name */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`font-display font-bold tracking-tight transition-all duration-300 text-theme ${
              scrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
          >
            {siteConfig.name}
          </a>

          {/* Nav Links + Theme Toggle */}
          <div className="flex items-center gap-6 md:gap-8">
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`font-display relative text-sm font-medium tracking-wide transition-all duration-300 ${
                    activeSection === link.href.slice(1)
                      ? 'text-theme'
                      : 'text-theme-muted hover:text-theme-secondary'
                  }`}
                  style={{
                    transitionDelay: scrolled ? `${index * 50}ms` : '0ms',
                  }}
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

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-theme-muted hover:text-theme rounded-lg transition-colors"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
