/**
 * BLOG POSTS INDEX
 *
 * This file automatically collects all blog posts.
 * To add a new post: just create a new .ts file in this folder!
 */

export interface BlogPost {
  title: string;
  excerpt: string;
  category: 'Tech' | 'Startups' | 'AI';
  date: string;
  readTime: string;
  featured?: boolean;
  content: string;
}

export interface BlogPostWithSlug extends BlogPost {
  slug: string;
}

// Import all posts
import discordTelegramAiBot from './discord-telegram-ai-bot';
import buildingMvpsThatShip from './building-mvps-that-ship';
import automatingWorkflowsWithAi from './automating-workflows-with-ai';

// Export all posts with their slugs (filename = slug)
export const blogPosts: BlogPostWithSlug[] = [
  { slug: 'discord-telegram-ai-bot', ...discordTelegramAiBot },
  { slug: 'building-mvps-that-ship', ...buildingMvpsThatShip },
  { slug: 'automating-workflows-with-ai', ...automatingWorkflowsWithAi },
];

// Helper to get a single post by slug
export function getPostBySlug(slug: string): BlogPostWithSlug | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// Get all slugs (for static generation)
export function getAllSlugs(): string[] {
  return blogPosts.map(post => post.slug);
}
