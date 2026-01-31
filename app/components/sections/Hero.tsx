'use client';

import { useState } from 'react';
import { siteConfig } from '@/app/data/content';
import Image from 'next/image';

interface HeroProps {
  onContactClick: () => void;
  onWorkClick: () => void;
}

export function Hero({ onContactClick, onWorkClick }: HeroProps) {
  const [imageError, setImageError] = useState(false);
  const initials = siteConfig.name.charAt(0).toUpperCase();

  return (
    <section className="min-h-screen flex flex-col justify-center relative -mt-20 pt-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12 md:gap-16 lg:gap-24">
        {/* Text Content */}
        <div className="flex-1">
          {/* Animated line */}
          <div className="h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent mb-12 animate-line-expand" />

          {/* Greeting */}
          <div className="opacity-0 animate-hero-reveal [animation-delay:200ms]">
            <p className="text-2xl md:text-3xl lg:text-4xl text-theme-secondary mb-2 flex items-center gap-3">
              Hello
              <span className="inline-block cursor-pointer hover:animate-wave origin-[70%_70%]">👋</span>
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              <span className="text-theme">I'm </span>
              <span className="text-gradient inline-block">{siteConfig.name}</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-theme-secondary font-normal leading-relaxed max-w-xl lg:max-w-2xl mb-12 opacity-0 animate-hero-reveal [animation-delay:500ms]">
            {siteConfig.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 opacity-0 animate-hero-reveal [animation-delay:800ms]">
            <button
              onClick={onContactClick}
              className="group relative overflow-hidden px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.5)] active:translate-y-0 active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative font-display font-semibold">Get in touch</span>
            </button>

            <button
              onClick={onWorkClick}
              className="relative px-8 py-4 text-theme-secondary font-display font-semibold transition-all duration-300 hover:text-theme after:content-[''] after:absolute after:bottom-3 after:left-8 after:right-8 after:h-[2px] after:bg-gradient-to-r after:from-indigo-500 after:to-purple-500 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
            >
              View my work
            </button>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="opacity-0 animate-hero-reveal [animation-delay:600ms] flex-shrink-0">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image container */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 rounded-2xl overflow-hidden border border-theme bg-theme-secondary">
              {!imageError ? (
                <Image
                  src="/profile.jpg"
                  alt={siteConfig.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                /* Fallback - stylish initials */
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-600/20 to-purple-600/20">
                  <span className="text-6xl md:text-7xl font-light text-theme/80">{initials}</span>
                </div>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Decorative corner accents */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-lg" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-purple-500/50 rounded-br-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
