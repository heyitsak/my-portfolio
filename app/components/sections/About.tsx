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
      </section>
    </ScrollReveal>
  );
}
