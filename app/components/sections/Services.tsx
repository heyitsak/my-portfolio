'use client';

import { services } from '@/app/data/content';
import { ScrollReveal, StaggerContainer } from '@/app/components/ui/ScrollReveal';
import { SectionHeading } from '@/app/components/ui/SectionHeading';

// Icons for services
const icons = [
  <svg key="1" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>,
  <svg key="2" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>,
  <svg key="3" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>,
  <svg key="4" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
  </svg>,
];

const colors = [
  { ring: 'border-indigo-500/30 group-hover:border-indigo-500', icon: 'text-indigo-400', glow: 'bg-indigo-500' },
  { ring: 'border-purple-500/30 group-hover:border-purple-500', icon: 'text-purple-400', glow: 'bg-purple-500' },
  { ring: 'border-blue-500/30 group-hover:border-blue-500', icon: 'text-blue-400', glow: 'bg-blue-500' },
  { ring: 'border-emerald-500/30 group-hover:border-emerald-500', icon: 'text-emerald-400', glow: 'bg-emerald-500' },
];

export function Services() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ScrollReveal>
      <section id="services" className="mb-40 scroll-mt-24">
        <SectionHeading>What I do</SectionHeading>

        {/* Circular/Orbital layout */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12" staggerDelay={100}>
          {services.map((service, index) => (
            <ServiceOrb key={index} {...service} icon={icons[index]} color={colors[index]} index={index} />
          ))}
        </StaggerContainer>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Have a project in mind?</p>
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 text-white font-display font-semibold rounded-full transition-all duration-300 hover:scale-105"
          >
            Let's discuss
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>
    </ScrollReveal>
  );
}

interface ServiceOrbProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: { ring: string; icon: string; glow: string };
  index: number;
}

function ServiceOrb({ title, description, icon, color, index }: ServiceOrbProps) {
  return (
    <div className="group relative flex items-start gap-6 p-6 rounded-3xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] hover:border-white/[0.08] transition-all duration-500">
      {/* Circular icon container */}
      <div className="relative flex-shrink-0">
        {/* Outer ring */}
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 ${color.ring} transition-colors duration-300 flex items-center justify-center`}>
          {/* Inner circle with icon */}
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 flex items-center justify-center ${color.icon}`}>
            {icon}
          </div>
        </div>

        {/* Glow effect on hover */}
        <div className={`absolute inset-0 rounded-full ${color.glow} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

        {/* Number badge */}
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
          <span className="text-xs font-display font-bold text-gray-500">{index + 1}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <h3 className="font-display text-lg md:text-xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Hover arrow */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </div>
    </div>
  );
}
