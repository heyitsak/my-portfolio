import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "../_posts";
import { BlogContent } from "./BlogContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} — Akhil`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen text-theme relative">
      <article className="w-full max-w-3xl lg:max-w-4xl mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-32">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-theme-muted hover:text-indigo-400 transition-colors mb-12 group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to blog
        </Link>

        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1.5 text-xs font-medium text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              {post.category}
            </span>
            <span className="text-sm text-theme-muted">{post.date}</span>
            <span className="text-sm text-theme-muted">•</span>
            <span className="text-sm text-theme-muted">{post.readTime}</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-theme leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-theme-secondary leading-relaxed">
            {post.excerpt}
          </p>

          {/* Divider */}
          <div className="mt-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </header>

        {/* Content */}
        <BlogContent content={post.content} />

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link
              href="/blog"
              className="text-theme-muted hover:text-indigo-400 transition-colors"
            >
              ← Back to all posts
            </Link>
            <Link
              href="/#contact"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all"
            >
              Get in touch
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}
