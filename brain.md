# Portfolio - How to Add Content

This guide explains how to add new blog posts and travel stories to your portfolio.

---

## Adding a New Blog Post

**Location:** `/app/data/blog/`

### Steps:
1. Copy the file `_template.ts`
2. Rename it to `your-post-name.ts` (use dashes, lowercase)
3. Edit the content inside
4. Save - done!

The filename becomes the URL. For example:
- `my-new-post.ts` → `/blog/my-new-post`
- `react-tips.ts` → `/blog/react-tips`

### Then update the index:

Open `/app/data/blog/index.ts` and:
1. Add an import at the top:
   ```typescript
   import myNewPost from './my-new-post';
   ```
2. Add it to the `blogPosts` array:
   ```typescript
   { slug: 'my-new-post', ...myNewPost },
   ```

### Example blog post file:

```typescript
// /app/data/blog/my-new-post.ts

import { BlogPost } from './index';

const post: BlogPost = {
  title: 'My New Post Title',
  excerpt: 'Short description for the listing page.',
  category: 'Tech',        // Options: 'Tech', 'Startups', 'AI'
  date: 'Jan 15, 2024',
  readTime: '5 min read',
  featured: false,         // true = shows "Featured" badge

  content: `
    <p class="lead">This intro paragraph appears larger.</p>

    <h2>First Section</h2>
    <p>Your content here...</p>

    <h2>Another Section</h2>
    <ul>
      <li>Bullet point</li>
      <li>Another point</li>
    </ul>

    <p>Contact me: <a href="/#contact">Get in touch</a></p>
  `,
};

export default post;
```

---

## Adding a New Travel Story

**Location:** `/app/data/stories/`

### Steps:
1. Copy the file `_template.ts`
2. Rename it to `your-story-name.ts` (use dashes, lowercase)
3. Edit the content inside
4. Add your image to `/public/stories/`
5. Save - done!

### Then update the index:

Open `/app/data/stories/index.ts` and:
1. Add an import at the top:
   ```typescript
   import myTrip from './my-trip';
   ```
2. Add it to the `travelStories` array:
   ```typescript
   { slug: 'my-trip', ...myTrip },
   ```

### Example story file:

```typescript
// /app/data/stories/my-trip.ts

import { TravelStory } from './index';

const story: TravelStory = {
  title: 'My Amazing Trip',
  excerpt: 'Short description for the listing page.',
  location: 'Paris, France',
  date: 'Summer 2024',
  image: '/stories/paris.jpg',  // Add this image to /public/stories/

  content: `
    <p>Start with an engaging intro...</p>

    <h2>The Journey</h2>
    <p>What happened...</p>

    <h2>Highlights</h2>
    <p>Best moments...</p>
  `,
};

export default story;
```

---

## HTML Tags You Can Use

| Tag | What it does | Example |
|-----|-------------|---------|
| `<p>` | Paragraph | `<p>Your text</p>` |
| `<h2>` | Section heading | `<h2>My Section</h2>` |
| `<h3>` | Sub-heading | `<h3>Details</h3>` |
| `<ul><li>` | Bullet list | `<ul><li>Item</li></ul>` |
| `<ol><li>` | Numbered list | `<ol><li>Step 1</li></ol>` |
| `<strong>` | Bold | `<strong>important</strong>` |
| `<a href="">` | Link | `<a href="/contact">link</a>` |
| `<pre><code>` | Code block | `<pre><code>code</code></pre>` |
| `class="lead"` | Large intro | `<p class="lead">Intro</p>` |

---

## File Structure

```
/app/data/
├── blog/
│   ├── index.ts              # Collects all posts
│   ├── _template.ts          # Copy this to create a post
│   ├── discord-telegram-ai-bot.ts
│   ├── building-mvps-that-ship.ts
│   └── automating-workflows-with-ai.ts
│
├── stories/
│   ├── index.ts              # Collects all stories
│   ├── _template.ts          # Copy this to create a story
│   ├── road-trip-mountains.ts
│   ├── coastal-photography.ts
│   └── city-exploration.ts
│
└── content.ts                # Site config, services, testimonials
```

---

## Other Content

For **projects**, **testimonials**, **services**, and **site config**, edit:
`/app/data/content.ts`

---

## Quick Reference

| I want to... | Do this |
|--------------|---------|
| Add a blog post | Copy `/app/data/blog/_template.ts`, rename, edit, update index |
| Add a travel story | Copy `/app/data/stories/_template.ts`, rename, edit, update index |
| Add a project | Edit `/app/data/content.ts` → `projects` array |
| Add a testimonial | Edit `/app/data/content.ts` → `testimonials` array |
| Change site name | Edit `/app/data/content.ts` → `siteConfig` |

---

## Development

```bash
npm run dev    # Start dev server
npm run build  # Build for production
```

---

*Last updated: January 2024*
