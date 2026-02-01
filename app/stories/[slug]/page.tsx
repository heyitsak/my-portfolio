import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoryBySlug, getAllSlugs } from "../_posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    return { title: "Story Not Found" };
  }

  return {
    title: `${story.title} — Akhil`,
    description: story.excerpt,
  };
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  return (
    <main className="min-h-screen text-theme relative">
      <article className="w-full max-w-3xl lg:max-w-4xl xl:max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-32">
        {/* Back link */}
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 text-theme-muted hover:text-theme transition-colors mb-12 group"
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
          Back to stories
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4 text-sm text-theme-muted">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {story.location}
            <span>•</span>
            {story.date}
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-theme">
            {story.title}
          </h1>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-display prose-headings:text-theme prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-p:text-theme-secondary prose-p:leading-relaxed
            prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-theme"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {story.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
