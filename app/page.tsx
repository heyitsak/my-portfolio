'use client';

import { Navbar } from '@/app/components/sections/Navbar';
import { Hero } from '@/app/components/sections/Hero';
import { About } from '@/app/components/sections/About';
import { Services } from '@/app/components/sections/Services';
import { Work } from '@/app/components/sections/Work';
import { BeyondWork } from '@/app/components/sections/BeyondWork';
import { Contact } from '@/app/components/sections/Contact';
import { PageLoader } from '@/app/components/ui/PageLoader';

export default function Home() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageLoader>
      <Navbar />

      <main className="min-h-screen bg-[#0a0a0a] text-gray-100 relative overflow-x-hidden">
        {/* Background gradient orbs */}
        <div className="fixed top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,transparent_70%)] blur-3xl pointer-events-none" />
        <div className="fixed bottom-[20%] left-[-300px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none" />

        <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-32 relative">
          <Hero
            onContactClick={() => scrollToSection('contact')}
            onWorkClick={() => scrollToSection('work')}
          />
          <About />
          <Services />
          <Work />
          <BeyondWork />
          <Contact />
        </div>
      </main>
    </PageLoader>
  );
}
