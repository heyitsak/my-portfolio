'use client';

import Image from 'next/image';
import { beyondWork } from '@/app/data/content';
import { ScrollReveal } from '@/app/components/ui/ScrollReveal';
import { SectionHeading } from '@/app/components/ui/SectionHeading';

export function BeyondWork() {
  return (
    <ScrollReveal>
      <section className="mb-40">
        <SectionHeading>Beyond work</SectionHeading>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Illustration - Left Side */}
          <div className="flex-shrink-0 w-full lg:w-[400px]">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10">
              <Image
                src="/illustrations/adventure.svg"
                alt="Adventure illustration - motorcycle camping in mountains with a German Shepherd"
                fill
                className="object-contain"
                unoptimized
              />
              {/* Subtle overlay glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>

          {/* Content - Right Side */}
          <div className="flex-1">
            <p className="text-base md:text-lg text-theme-secondary leading-relaxed mb-6">
              {beyondWork.text}
            </p>

            <p className="text-base md:text-lg text-theme-secondary leading-relaxed mb-8">
              When I&apos;m not coding, you&apos;ll find me planning the next road trip, exploring mountain trails on my bike, or spending time with my loyal companion. There&apos;s something about the open road that clears the mind and sparks creativity.
            </p>

            {/* Travel stories link */}
            <a
              href="/stories"
              className="group inline-flex items-center gap-3 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </span>
              <div>
                <span className="font-display font-semibold block">Read my travel stories</span>
                <span className="text-sm text-theme-muted">Adventures, photography & more</span>
              </div>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
