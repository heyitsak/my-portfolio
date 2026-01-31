/**
 * TRAVEL STORIES INDEX
 *
 * This file automatically collects all travel stories.
 * To add a new story: just create a new .ts file in this folder!
 */

export interface TravelStory {
  title: string;
  excerpt: string;
  location: string;
  date: string;
  image: string;
  content: string;
}

export interface TravelStoryWithSlug extends TravelStory {
  slug: string;
}

// Import all stories
import roadTripMountains from './road-trip-mountains';
import coastalPhotography from './coastal-photography';
import cityExploration from './city-exploration';

// Export all stories with their slugs (filename = slug)
export const travelStories: TravelStoryWithSlug[] = [
  { slug: 'road-trip-mountains', ...roadTripMountains },
  { slug: 'coastal-photography', ...coastalPhotography },
  { slug: 'city-exploration', ...cityExploration },
];

// Helper to get a single story by slug
export function getStoryBySlug(slug: string): TravelStoryWithSlug | undefined {
  return travelStories.find(story => story.slug === slug);
}

// Get all slugs (for static generation)
export function getAllSlugs(): string[] {
  return travelStories.map(story => story.slug);
}
