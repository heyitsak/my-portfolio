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
import { getAllPosts } from '@/app/blog/_posts';

export default function Home() {
  // Get blog posts at build time (server component)
  const posts = getAllPosts().map(({ slug, title, excerpt, category, date, readTime, featured }) => ({
    slug, title, excerpt, category, date, readTime, featured
  }));

  return (
    <PageLoader>
      <Navbar />

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      <main className="min-h-screen text-theme relative overflow-x-hidden">
        <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-20 md:py-32 relative">
          <Hero />
          <About />
          <Services />
          <Work />
          <Testimonials />
          <Blog posts={posts} />
          <BeyondWork />
          <Contact />
        </div>
      </main>

      {/* AI Chatbot - floating on all pages */}
      <AIChatbot />
    </PageLoader>
  );
}
