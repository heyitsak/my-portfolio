'use client';

import { useState } from 'react';
import { ScrollReveal } from '@/app/components/ui/ScrollReveal';
import { SectionHeading } from '@/app/components/ui/SectionHeading';

const categories = ['All', 'Tech', 'Startups', 'AI'];

const blogPosts = [
  {
    title: 'Building MVPs That Actually Ship',
    excerpt: 'Lessons learned from helping startups go from idea to launched product in weeks, not months.',
    category: 'Startups',
    date: 'Jan 2024',
    readTime: '5 min read',
    link: '#',
  },
  {
    title: 'Automating Workflows with AI',
    excerpt: 'How I use AI tools to automate repetitive tasks and save hours every week.',
    category: 'AI',
    date: 'Dec 2023',
    readTime: '4 min read',
    link: '#',
  },
  {
    title: 'The Tech Stack I Use in 2024',
    excerpt: 'My go-to tools, frameworks, and services for building modern web applications.',
    category: 'Tech',
    date: 'Nov 2023',
    readTime: '6 min read',
    link: '#',
  },
  {
    title: 'E-commerce Integration Patterns',
    excerpt: 'Best practices for integrating payment gateways and managing order workflows.',
    category: 'Tech',
    date: 'Oct 2023',
    readTime: '7 min read',
    link: '#',
  },
];

export function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

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
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredPosts.map((post, index) => (
            <BlogCard key={index} {...post} />
          ))}
        </div>

        {/* View more link */}
        <div className="mt-10 text-center">
          <a
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
          </a>
        </div>
      </section>
    </ScrollReveal>
  );
}

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  link: string;
}

function BlogCard({ title, excerpt, category, date, readTime, link }: BlogCardProps) {
  return (
    <a
      href={link}
      className="group block p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300"
    >
      {/* Meta */}
      <div className="flex items-center gap-3 mb-4">
        <span className="px-2 py-1 text-xs font-medium text-indigo-400 bg-indigo-500/10 rounded-md">
          {category}
        </span>
        <span className="text-xs text-gray-500">{date}</span>
        <span className="text-xs text-gray-600">•</span>
        <span className="text-xs text-gray-500">{readTime}</span>
      </div>

      {/* Title */}
      <h3 className="font-display text-lg md:text-xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
        {title}
      </h3>

      {/* Excerpt */}
      <p className="text-gray-500 text-sm leading-relaxed mb-4">
        {excerpt}
      </p>

      {/* Read more */}
      <span className="inline-flex items-center gap-1 text-sm text-gray-400 group-hover:text-indigo-400 transition-colors">
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
    </a>
  );
}
