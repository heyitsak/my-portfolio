'use client';

import { beyondWork } from '@/app/data/content';
import { ScrollReveal } from '@/app/components/ui/ScrollReveal';
import { SectionHeading } from '@/app/components/ui/SectionHeading';

export function BeyondWork() {
  return (
    <ScrollReveal>
      <section className="mb-40">
        <SectionHeading>Beyond work</SectionHeading>
        <p className="text-base md:text-lg text-gray-400 leading-relaxed">
          {beyondWork}
        </p>
      </section>
    </ScrollReveal>
  );
}
