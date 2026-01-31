import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// This would typically come from a CMS, MDX files, or database
const posts: Record<string, { title: string; date: string; content: string; category: string }> = {
  'building-mvps-that-ship': {
    title: 'Building MVPs That Actually Ship',
    date: 'January 15, 2024',
    category: 'Startups',
    content: `
      <p>Coming soon...</p>
      <p>This is a placeholder for your blog post content. You can write your posts here or integrate with a CMS like Contentful, Sanity, or use MDX files.</p>
    `,
  },
  'automating-workflows-with-ai': {
    title: 'Automating Workflows with AI',
    date: 'December 20, 2023',
    category: 'AI',
    content: `
      <p>Coming soon...</p>
      <p>This is a placeholder for your blog post content.</p>
    `,
  },
  'tech-stack-2024': {
    title: 'The Tech Stack I Use in 2024',
    date: 'November 10, 2023',
    category: 'Tech',
    content: `
      <p>Coming soon...</p>
      <p>This is a placeholder for your blog post content.</p>
    `,
  },
  'ecommerce-integration-patterns': {
    title: 'E-commerce Integration Patterns',
    date: 'October 5, 2023',
    category: 'Tech',
    content: `
      <p>Coming soon...</p>
      <p>This is a placeholder for your blog post content.</p>
    `,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} — Akhil`,
    description: post.title,
  };
}

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <article className="max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-32">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 text-xs font-medium text-indigo-400 bg-indigo-500/10 rounded-md">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">{post.date}</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            {post.title}
          </h1>
        </header>

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none prose-p:text-gray-400 prose-headings:text-white prose-a:text-indigo-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
