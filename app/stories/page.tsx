import { Metadata } from 'next';
import Link from 'next/link';
import { travelStories } from '@/app/data/stories';

export const metadata: Metadata = {
  title: 'Travel Stories — Akhil',
  description: 'Adventures, photography, and stories from my travels.',
};

export default function StoriesPage() {
  return (
    <main className="min-h-screen text-theme relative">
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-6 md:px-12 py-20 md:py-32">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-theme-muted hover:text-theme transition-colors mb-12 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        {/* Header */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-theme">
          Travel Stories
        </h1>
        <p className="text-lg text-theme-secondary mb-16">
          Adventures, photography, and moments from my travels.
        </p>

        {/* Stories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {travelStories.map((story) => (
            <Link
              key={story.slug}
              href={`/stories/${story.slug}`}
              className="group block"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-theme-secondary mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />
                {/* Placeholder - replace with actual images */}
                <div className="absolute inset-0 flex items-center justify-center text-theme-muted">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="flex items-center gap-2 mb-2 text-sm text-theme-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {story.location}
                <span className="text-theme-muted">•</span>
                {story.date}
              </div>

              <h2 className="font-display text-xl font-semibold text-theme group-hover:text-indigo-300 transition-colors mb-2">
                {story.title}
              </h2>

              <p className="text-theme-muted text-sm">
                {story.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
