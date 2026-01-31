/**
 * TRAVEL STORY TEMPLATE
 *
 * TO ADD A NEW STORY:
 * 1. Copy this file
 * 2. Rename it to your-story-url.ts (use dashes, lowercase)
 * 3. Fill in the content below
 * 4. Add your cover image to /public/stories/
 * 5. Save - your story will automatically appear!
 *
 * The filename becomes the URL: my-trip.ts -> /stories/my-trip
 */

import { TravelStory } from './index';

const story: TravelStory = {
  title: 'Your Story Title Here',
  excerpt: 'A short description shown on the stories listing page.',
  location: 'City, Country',
  date: 'January 2024',
  image: '/stories/your-image.jpg', // Add image to /public/stories/

  // Write your content using simple HTML tags:
  // <p>        - Paragraph
  // <h2>       - Section heading
  // <ul><li>   - Bullet list

  content: `
    <p>Start with an engaging intro about your adventure...</p>

    <h2>The Journey</h2>
    <p>Describe what happened. Be vivid and personal.</p>

    <h2>Highlights</h2>
    <p>What were the best moments?</p>

    <h2>What I Learned</h2>
    <p>Any insights or reflections?</p>
  `,
};

export default story;
