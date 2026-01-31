'use client';

import { useState } from 'react';
import Link from 'next/link';
import { blogPosts } from '@/app/data/blog';
import { ScrollReveal } from '@/app/components/ui/ScrollReveal';
import { SectionHeading } from '@/app/components/ui/SectionHeading';

const categories = ['All', 'Tech', 'Startups', 'AI'];

export function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All'
    ? blogPosts.slice(0, 4) // Show first 4 on homepage
    : blogPosts.filter(post => post.category === activeCategory).slice(0, 4);

  return (
    <ScrollReveal>
      <section id="blog" className="mb-40 scroll-mt-24">
        <SectionHeading>Blog</SectionHeading>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm font-display font-medium rounded-full transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-indigo-500 text-white'
                  : 'bg-theme-card text-theme-muted hover:bg-theme-card-hover hover:text-theme'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>

        {/* View more link */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-display font-semibold transition-colors group"
          >
            View all posts
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </ScrollReveal>
  );
}

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

function BlogCard({ slug, title, excerpt, category, date, readTime, featured }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className={`group block p-6 rounded-2xl bg-theme-card border transition-all duration-300 ${
        featured
          ? 'border-indigo-500/30 hover:border-indigo-500/50'
          : 'border-theme hover:border-indigo-500/30'
      } hover:bg-theme-card-hover`}
    >
      {/* Meta */}
      <div className="flex items-center gap-3 mb-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-md ${
          featured
            ? 'text-indigo-300 bg-indigo-500/20'
            : 'text-indigo-400 bg-indigo-500/10'
        }`}>
          {category}
        </span>
        {featured && (
          <span className="px-2 py-1 text-xs font-medium text-amber-400 bg-amber-500/10 rounded-md">
            Featured
          </span>
        )}
        <span className="text-xs text-theme-muted">{date}</span>
        <span className="text-xs text-theme-muted">•</span>
        <span className="text-xs text-theme-muted">{readTime}</span>
      </div>

      {/* Title */}
      <h3 className="font-display text-lg md:text-xl font-semibold text-theme mb-2 group-hover:text-indigo-300 transition-colors">
        {title}
      </h3>

      {/* Excerpt */}
      <p className="text-theme-muted text-sm leading-relaxed mb-4">
        {excerpt}
      </p>

      {/* Read more */}
      <span className="inline-flex items-center gap-1 text-sm text-theme-muted group-hover:text-indigo-400 transition-colors">
        Read more
        <svg
          className="w-3 h-3 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
