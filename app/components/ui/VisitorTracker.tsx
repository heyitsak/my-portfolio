'use client';

import { useEffect, useRef } from 'react';

export function VisitorTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per page load
    if (tracked.current) return;
    tracked.current = true;

    // Small delay to not block initial render
    const timer = setTimeout(() => {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: window.location.pathname,
          referrer: document.referrer || 'Direct',
          userAgent: navigator.userAgent,
        }),
      }).catch(() => {
        // Silently fail - tracking is not critical
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
