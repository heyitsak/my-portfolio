import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Akhil',
  description: 'Thoughts on tech, startups, and building products.',
};

// Blog posts data - move to data/blog.ts when you have more posts
const posts = [
  {
    slug: 'building-mvps-that-ship',
    title: 'Building MVPs That Actually Ship',
    excerpt: 'Lessons learned from helping startups go from idea to launched product in weeks, not months.',
    category: 'Startups',
    date: 'Jan 15, 2024',
    readTime: '5 min read',
  },
  {
    slug: 'automating-workflows-with-ai',
    title: 'Automating Workflows with AI',
    excerpt: 'How I use AI tools to automate repetitive tasks and save hours every week.',
    category: 'AI',
    date: 'Dec 20, 2023',
    readTime: '4 min read',
  },
  {
    slug: 'tech-stack-2024',
    title: 'The Tech Stack I Use in 2024',
    excerpt: 'My go-to tools, frameworks, and services for building modern web applications.',
    category: 'Tech',
    date: 'Nov 10, 2023',
    readTime: '6 min read',
  },
  {
    slug: 'ecommerce-integration-patterns',
    title: 'E-commerce Integration Patterns',
    excerpt: 'Best practices for integrating payment gateways and managing order workflows.',
    category: 'Tech',
    date: 'Oct 5, 2023',
    readTime: '7 min read',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="max-w-3xl lg:max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-32">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        {/* Header */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Blog
        </h1>
        <p className="text-lg text-gray-400 mb-16">
          Thoughts on tech, startups, and building products.
        </p>

        {/* Posts list */}
        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 text-xs font-medium text-indigo-400 bg-indigo-500/10 rounded-md">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{post.date}</span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                </div>

                <h2 className="font-display text-xl md:text-2xl font-semibold text-white group-hover:text-indigo-300 transition-colors mb-2">
                  {post.title}
                </h2>

                <p className="text-gray-500 leading-relaxed mb-4">
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
