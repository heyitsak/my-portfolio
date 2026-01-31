'use client';

import { Navbar } from '@/app/components/sections/Navbar';
import { Hero } from '@/app/components/sections/Hero';
import { About } from '@/app/components/sections/About';
import { Services } from '@/app/components/sections/Services';
import { Work } from '@/app/components/sections/Work';
import { Testimonials } from '@/app/components/sections/Testimonials';
import { Blog } from '@/app/components/sections/Blog';
import { BeyondWork } from '@/app/components/sections/BeyondWork';
import { Contact } from '@/app/components/sections/Contact';
import { PageLoader } from '@/app/components/ui/PageLoader';
import { AIChatbot } from '@/app/components/ui/AIChatbot';

export default function Home() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageLoader>
      <Navbar />

      <main className="min-h-screen text-theme relative overflow-x-hidden">
        <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-32 relative">
          <Hero
            onContactClick={() => scrollToSection('contact')}
            onWorkClick={() => scrollToSection('work')}
          />
          <About />
          <Services />
          <Work />
          <Testimonials />
          <Blog />
          <BeyondWork />
          <Contact />
        </div>
      </main>

      {/* AI Chatbot - floating on all pages */}
      <AIChatbot />
    </PageLoader>
  );
}
