'use client';

import { projects } from '@/app/data/content';
import { ScrollReveal, StaggerContainer } from '@/app/components/ui/ScrollReveal';
import { SectionHeading } from '@/app/components/ui/SectionHeading';
import Image from 'next/image';

export function Work() {
  return (
    <ScrollReveal>
      <section id="work" className="mb-40 scroll-mt-24">
        <SectionHeading>Work</SectionHeading>

        <StaggerContainer className="space-y-24 lg:space-y-32" staggerDelay={200}>
          {projects.map((project, index) => (
            <ProjectRow key={index} {...project} index={index} isReversed={index % 2 !== 0} />
          ))}
        </StaggerContainer>
      </section>
    </ScrollReveal>
  );
}

interface ProjectRowProps {
  title: string;
  year: string;
  description: string;
  tags: string[];
  index: number;
  isReversed: boolean;
}

function ProjectRow({ title, year, description, tags, index, isReversed }: ProjectRowProps) {
  return (
    <div className={`group flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center`}>
      {/* Content Side */}
      <div className="flex-1 w-full">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-display text-sm font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
            {year}
          </span>
          <span className="text-gray-600 text-sm">Project {String(index + 1).padStart(2, '0')}</span>
        </div>

        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors duration-300">
          {title}
        </h3>

        <p className="text-gray-400 text-base leading-relaxed mb-6 max-w-lg">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium text-gray-400 bg-white/5 border border-white/10 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action links */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-display font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group/link"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            View on GitHub
            <svg className="w-3 h-3 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#contact"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Request details
          </a>
        </div>
      </div>

      {/* Image Side */}
      <div className="flex-1 w-full">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 group-hover:border-indigo-500/30 transition-colors duration-500">
          {/* Placeholder gradient - replace with actual project images */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />

          {/* Project number watermark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[120px] md:text-[160px] font-bold text-white/[0.03] select-none">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-lg" />
        </div>
      </div>
    </div>
  );
}
