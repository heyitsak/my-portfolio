import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/app/data/content';

export const metadata: Metadata = {
  title: 'Blog — Akhil',
  description: 'Thoughts on tech, startups, and building products.',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen text-theme relative">
      <div className="max-w-3xl lg:max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-32">
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
          Blog
        </h1>
        <p className="text-lg text-theme-secondary mb-16">
          Thoughts on tech, startups, and building products.
        </p>

        {/* Posts list */}
        <div className="space-y-12">
          {blogPosts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                    post.featured
                      ? 'text-indigo-300 bg-indigo-500/20'
                      : 'text-indigo-400 bg-indigo-500/10'
                  }`}>
                    {post.category}
                  </span>
                  {post.featured && (
                    <span className="px-2 py-1 text-xs font-medium text-amber-400 bg-amber-500/10 rounded-md">
                      Featured
                    </span>
                  )}
                  <span className="text-xs text-theme-muted">{post.date}</span>
                  <span className="text-xs text-theme-muted">•</span>
                  <span className="text-xs text-theme-muted">{post.readTime}</span>
                </div>

                <h2 className="font-display text-xl md:text-2xl font-semibold text-theme group-hover:text-indigo-300 transition-colors mb-2">
                  {post.title}
                </h2>

                <p className="text-theme-secondary leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                <span className="inline-flex items-center gap-1 text-sm text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  Read more
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
