'use client';

import { useState, useEffect } from 'react';
import { siteConfig } from '@/app/data/content';

export function PageLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Small delay before starting the exit animation
    const timer1 = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // Remove the loader from DOM after animation completes
    const timer2 = setTimeout(() => {
      setIsVisible(false);
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <>
      {/* Loader Overlay */}
      {isVisible && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] transition-all duration-700 ease-out ${
            isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Animated logo/name */}
          <div className={`flex flex-col items-center transition-all duration-500 ${
            isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            {/* Pulsing ring */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-2 border-indigo-500/30 flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-white">{siteConfig.name.charAt(0)}</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>

            {/* Loading line */}
            <div className="w-24 h-0.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-loading-bar" />
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div
        className={`transition-all duration-700 ease-out ${
          isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
        style={{ transitionDelay: isLoading ? '0ms' : '200ms' }}
      >
        {children}
      </div>
    </>
  );
}
