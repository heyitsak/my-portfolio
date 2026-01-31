/**
 * BLOG POST TEMPLATE
 *
 * TO ADD A NEW POST:
 * 1. Copy this file
 * 2. Rename it to your-post-url.ts (use dashes, lowercase)
 * 3. Fill in the content below
 * 4. Save - your post will automatically appear!
 *
 * The filename becomes the URL: my-post.ts -> /blog/my-post
 */

import { BlogPost } from './index';

const post: BlogPost = {
  title: 'Your Post Title Here',
  excerpt: 'A short 1-2 sentence description shown on the blog listing.',
  category: 'Tech', // Options: 'Tech', 'Startups', 'AI'
  date: 'Jan 1, 2024',
  readTime: '5 min read',
  featured: false, // Set true to show "Featured" badge

  // Write your content using simple HTML tags:
  // <p>        - Paragraph
  // <h2>       - Section heading
  // <h3>       - Sub-heading
  // <ul><li>   - Bullet list
  // <ol><li>   - Numbered list
  // <strong>   - Bold text
  // <a href=""> - Link
  // <pre><code> - Code block

  content: `
    <p class="lead">This intro paragraph appears larger. Hook your reader here!</p>

    <h2>First Section</h2>
    <p>Your main content goes here. Write naturally.</p>

    <h2>Another Section</h2>
    <p>Add as many sections as you need.</p>
    <ul>
      <li>Bullet point one</li>
      <li>Bullet point two</li>
    </ul>

    <p>End with a call to action: <a href="/#contact">Get in touch</a>!</p>
  `,
};

export default post;
