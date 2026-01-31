'use client';

import { useState } from 'react';
import { testimonials } from '@/app/data/content';
import { ScrollReveal } from '@/app/components/ui/ScrollReveal';
import { SectionHeading } from '@/app/components/ui/SectionHeading';

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ScrollReveal>
      <section id="testimonials" className="mb-40 scroll-mt-24">
        <SectionHeading>What People Say</SectionHeading>

        <div className="relative">
          {/* Main testimonial display */}
          <div className="relative bg-theme-card border border-theme rounded-2xl p-8 md:p-12 mb-8">
            {/* Quote icon */}
            <svg
              className="absolute top-6 left-6 w-12 h-12 text-indigo-500/20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <div className="relative">
              {/* Testimonial content */}
              <blockquote className="text-lg md:text-xl text-theme-secondary leading-relaxed mb-8 pl-8">
                "{testimonials[activeIndex].content}"
              </blockquote>

              {/* Author info */}
              <div className="flex items-center gap-4 pl-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-display font-bold">
                  {testimonials[activeIndex].name.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-semibold text-theme">
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="text-sm text-theme-muted">
                    {testimonials[activeIndex].role} at {testimonials[activeIndex].company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-indigo-500 w-8'
                    : 'bg-theme-card hover:bg-theme-muted'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* All testimonials grid for larger screens */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                index === activeIndex
                  ? 'bg-indigo-500/10 border-indigo-500/30'
                  : 'bg-theme-card border-theme hover:border-indigo-500/20'
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <p className="text-sm text-theme-secondary mb-4 line-clamp-3">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-theme">{testimonial.name}</p>
                  <p className="text-xs text-theme-muted">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
