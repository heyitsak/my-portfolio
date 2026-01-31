import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Story data - would typically come from a CMS or MDX files
const stories: Record<string, { title: string; date: string; location: string; content: string }> = {
  'road-trip-mountains': {
    title: 'Road Trip Through the Mountains',
    date: 'December 2023',
    location: 'Western Ghats',
    content: `
      <p>Coming soon...</p>
      <p>This is a placeholder for your travel story. Add your photos, descriptions, and experiences here.</p>
    `,
  },
  'coastal-photography': {
    title: 'Coastal Photography Session',
    date: 'November 2023',
    location: 'Goa',
    content: `
      <p>Coming soon...</p>
      <p>This is a placeholder for your travel story.</p>
    `,
  },
  'city-exploration': {
    title: 'Urban Exploration',
    date: 'October 2023',
    location: 'Mumbai',
    content: `
      <p>Coming soon...</p>
      <p>This is a placeholder for your travel story.</p>
    `,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = stories[slug];

  if (!story) {
    return { title: 'Story Not Found' };
  }

  return {
    title: `${story.title} — Akhil`,
    description: story.title,
  };
}

export async function generateStaticParams() {
  return Object.keys(stories).map((slug) => ({ slug }));
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = stories[slug];

  if (!story) {
    notFound();
  }

  return (
    <main className="min-h-screen text-gray-100 relative">
      <article className="max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-32">
        {/* Back link */}
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to stories
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {story.location}
            <span className="text-gray-700">•</span>
            {story.date}
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="text-gradient">{story.title}</span>
          </h1>
        </header>

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none prose-p:text-gray-400 prose-headings:text-white prose-a:text-indigo-400"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />
      </article>
    </main>
  );
}
