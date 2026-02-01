'use client';

import { aboutContent } from '@/app/data/content';
import { ScrollReveal } from '@/app/components/ui/ScrollReveal';
import { SectionHeading } from '@/app/components/ui/SectionHeading';

export function About() {
  return (
    <ScrollReveal>
      <section id="about" className="mb-40 scroll-mt-24">
        <SectionHeading>About</SectionHeading>
        <div className="space-y-5 text-base md:text-lg text-theme-secondary leading-relaxed">
          {aboutContent.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Location Tag */}
        <div className="mt-8 flex items-center gap-2 text-theme-muted">
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">Based in <span className="text-indigo-400 font-medium">Bangalore, India</span></span>
        </div>
      </section>
    </ScrollReveal>
  );
}
