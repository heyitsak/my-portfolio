# Portfolio Project - Brain File

This document provides a complete overview of the portfolio project structure, how to modify content, and guidelines for future development.

---

## Project Structure

```
portfolio/
├── app/
│   ├── components/
│   │   ├── sections/           # Main page sections
│   │   │   ├── About.tsx       # About me section
│   │   │   ├── BeyondWork.tsx  # Hobbies/interests section
│   │   │   ├── Blog.tsx        # Blog posts grid
│   │   │   ├── Contact.tsx     # Contact form & social links
│   │   │   ├── Hero.tsx        # Landing hero section
│   │   │   ├── Navbar.tsx      # Navigation bar with theme toggle
│   │   │   ├── Services.tsx    # Services/offerings section
│   │   │   ├── Testimonials.tsx # Client testimonials
│   │   │   ├── Work.tsx        # Projects/portfolio showcase
│   │   │   └── index.ts        # Barrel export
│   │   │
│   │   └── ui/                 # Reusable UI components
│   │       ├── AIChatbot.tsx   # Floating AI chat assistant
│   │       ├── Button.tsx      # Button component
│   │       ├── PageLoader.tsx  # Initial page load animation
│   │       ├── ScrollReveal.tsx # Scroll animation wrapper
│   │       ├── SectionHeading.tsx # Section title component
│   │       ├── SocialIcons.tsx # Social media icon components
│   │       ├── ThemeProvider.tsx # Dark/light mode context + toggle
│   │       └── index.ts        # Barrel export
│   │
│   ├── data/
│   │   └── content.ts          # ⭐ ALL CONTENT METADATA LIVES HERE
│   │
│   ├── hooks/
│   │   └── useScrollReveal.ts  # Intersection observer hook
│   │
│   ├── blog/
│   │   ├── page.tsx            # Blog listing page (/blog)
│   │   └── [slug]/
│   │       └── page.tsx        # ⭐ BLOG POST CONTENT LIVES HERE
│   │
│   ├── stories/
│   │   ├── page.tsx            # Travel stories listing (/stories)
│   │   └── [slug]/
│   │       └── page.tsx        # ⭐ TRAVEL STORY CONTENT LIVES HERE
│   │
│   ├── globals.css             # Global styles & theme variables
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Homepage
│   └── favicon.ico
│
├── public/
│   ├── profile.jpg             # Your profile picture
│   ├── projects/               # Project images
│   │   ├── project-1.jpg
│   │   └── project-2.jpg
│   └── stories/                # Travel story images
│       ├── mountains.jpg
│       ├── coastal.jpg
│       └── city.jpg
│
├── .env.local                  # API keys (OpenAI, etc.)
├── brain.md                    # This file
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## 📝 Adding a New Blog Post (Tech/Work/AI)

Blog posts appear on the homepage under "Blog" section and at `/blog`.

### Step 1: Add Post Metadata

**File:** `/app/data/content.ts`

Find the `blogPosts` array and add your new post:

```typescript
export const blogPosts = [
  // ... existing posts above
  {
    slug: 'my-new-blog-post',        // URL-friendly name (no spaces, lowercase)
    title: 'My New Blog Post Title',  // Display title
    excerpt: 'A brief 1-2 sentence description that appears on the listing page.',
    category: 'Tech',                 // Options: 'Tech', 'Startups', 'AI'
    date: 'Feb 1, 2024',             // Display date
    readTime: '5 min read',          // Estimated read time
    featured: false,                  // Set true to highlight with a badge
  },
];
```

### Step 2: Add Post Content

**File:** `/app/blog/[slug]/page.tsx`

Find the `posts` object and add your content:

```typescript
const posts: Record<string, { title: string; date: string; content: string; category: string }> = {
  // ... existing posts above

  'my-new-blog-post': {
    title: 'My New Blog Post Title',
    date: 'February 1, 2024',
    category: 'Tech',
    content: `
      <p class="lead">This is the intro paragraph - it appears larger.</p>

      <h2>First Section Heading</h2>
      <p>Regular paragraph text goes here. You can write multiple paragraphs.</p>
      <p>Another paragraph with more details.</p>

      <h3>Subsection</h3>
      <p>Content for the subsection.</p>

      <ul>
        <li>Bullet point one</li>
        <li>Bullet point two</li>
        <li>Bullet point three</li>
      </ul>

      <h2>Code Examples</h2>
      <pre><code class="language-javascript">
const example = "Your code here";
console.log(example);
      </code></pre>

      <p>Wrap up your post with a conclusion or call to action.</p>
      <p>If you want to link somewhere, use: <a href="/#contact">contact me</a>.</p>
    `,
  },
};
```

### Step 3: Verify

Run `npm run dev` and visit:
- `/blog` - Your post should appear in the list
- `/blog/my-new-blog-post` - The full post page

---

## 🌍 Adding a New Travel Story

Travel stories appear under "Beyond Work" section and at `/stories`.

### Step 1: Add Story Metadata

**File:** `/app/data/content.ts`

Find the `travelStories` array and add your new story:

```typescript
export const travelStories = [
  // ... existing stories above
  {
    slug: 'my-new-adventure',         // URL-friendly name
    title: 'My New Adventure Title',   // Display title
    excerpt: 'Brief description of this travel experience.',
    location: 'City, Country',         // Where it happened
    date: 'January 2024',              // When it happened
    image: '/stories/my-adventure.jpg', // Cover image path
  },
];
```

### Step 2: Add Cover Image

**Location:** `/public/stories/`

1. Add your image file (e.g., `my-adventure.jpg`)
2. Recommended size: 1200x900px (4:3 ratio)
3. Formats: JPG, PNG, WebP

### Step 3: Add Story Content

**File:** `/app/stories/[slug]/page.tsx`

Find the `stories` object and add your content:

```typescript
const stories: Record<string, { title: string; date: string; location: string; content: string }> = {
  // ... existing stories above

  'my-new-adventure': {
    title: 'My New Adventure Title',
    date: 'January 2024',
    location: 'City, Country',
    content: `
      <p>Start with an engaging intro about your adventure...</p>

      <h2>The Journey Begins</h2>
      <p>Describe the start of your trip. What made you decide to go?</p>

      <h2>Highlights</h2>
      <p>What were the best moments? Include vivid descriptions.</p>

      <h2>What I Learned</h2>
      <p>Any insights or reflections from this experience?</p>

      <p>End with a memorable conclusion or recommendation for others.</p>
    `,
  },
};
```

### Step 4: Verify

Run `npm run dev` and visit:
- `/stories` - Your story should appear in the grid
- `/stories/my-new-adventure` - The full story page

---

## 💼 Adding a New Project/Work Item

Projects appear on the homepage under "Work" section.

### Step-by-Step

**File:** `/app/data/content.ts`

Find the `projects` array and add:

```typescript
export const projects = [
  // ... existing projects
  {
    title: 'My New Project',
    year: '2024',
    description: 'Brief description of what this project does and the problem it solves.',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL'],  // Technologies used
    image: '/projects/new-project.jpg',              // Optional: add to /public/projects/
    github: 'https://github.com/username/repo',      // Link to code
  },
];
```

---

## 💬 Adding a New Testimonial

Testimonials appear on the homepage under "What People Say" section.

### Step-by-Step

**File:** `/app/data/content.ts`

Find the `testimonials` array and add:

```typescript
export const testimonials = [
  // ... existing testimonials
  {
    name: 'John Smith',
    role: 'CEO',
    company: 'TechStartup Inc',
    content: 'Working with Akhil was fantastic. He delivered exactly what we needed, on time and with great communication throughout.',
  },
];
```

---

## HTML Tags You Can Use in Blog Posts

| Tag | Purpose | Example |
|-----|---------|---------|
| `<p>` | Paragraph | `<p>Your text here</p>` |
| `<h2>` | Main section heading | `<h2>Section Title</h2>` |
| `<h3>` | Subsection heading | `<h3>Subsection</h3>` |
| `<ul><li>` | Bullet list | `<ul><li>Item</li></ul>` |
| `<ol><li>` | Numbered list | `<ol><li>Step 1</li></ol>` |
| `<strong>` | Bold text | `<strong>important</strong>` |
| `<a href="">` | Link | `<a href="/contact">link</a>` |
| `<pre><code>` | Code block | `<pre><code>code here</code></pre>` |
| `<blockquote>` | Quote | `<blockquote>Quote text</blockquote>` |
| `class="lead"` | Large intro text | `<p class="lead">Intro</p>` |

---

## Quick Reference: Where Things Live

| Content Type | Metadata Location | Full Content Location |
|--------------|-------------------|----------------------|
| Blog Posts | `/app/data/content.ts` → `blogPosts` | `/app/blog/[slug]/page.tsx` → `posts` |
| Travel Stories | `/app/data/content.ts` → `travelStories` | `/app/stories/[slug]/page.tsx` → `stories` |
| Projects | `/app/data/content.ts` → `projects` | (metadata only) |
| Testimonials | `/app/data/content.ts` → `testimonials` | (metadata only) |
| Services | `/app/data/content.ts` → `services` | (metadata only) |
| About | `/app/data/content.ts` → `aboutContent` | (metadata only) |

---

## Features Overview

### Dark/Light Theme Toggle
- Managed by `/app/components/ui/ThemeProvider.tsx`
- Persists to localStorage
- Toggle button in Navbar
- CSS variables in `/app/globals.css`

### AI Chatbot
- Component: `/app/components/ui/AIChatbot.tsx`
- Currently uses predefined responses
- **To integrate with real AI:**
  1. Add OpenAI/Claude API key to `.env.local`
  2. Create API route in `/app/api/chat/route.ts`
  3. Update `AIChatbot.tsx` to call the API

### Scroll Animations
- Powered by Intersection Observer
- Wrapper: `<ScrollReveal>` component
- Stagger animations: `<StaggerContainer>`

### Navbar Features
- Scroll progress bar (gradient at bottom)
- Hide on scroll down, show on scroll up
- Theme toggle button

### Theme Colors

CSS variables are defined in `/app/globals.css`:

```css
:root {
  --color-bg: #000000;           /* Background */
  --color-text: #f3f4f6;         /* Primary text */
  --color-text-secondary: #9ca3af; /* Secondary text */
  --color-border: rgba(255,255,255,0.1);
  --color-accent: #6366f1;       /* Indigo accent */
}
```

---

## Image Guidelines

| Type | Location | Recommended Size |
|------|----------|------------------|
| Profile | `/public/profile.jpg` | 400x400px |
| Projects | `/public/projects/` | 800x600px (4:3) |
| Stories | `/public/stories/` | 1200x900px (4:3) |

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## Deployment

The project is optimized for:
- **Vercel** (recommended) - Just connect your repo
- **Netlify** - Works out of the box
- **Self-hosted** - Run `npm run build` then `npm start`

### Environment Variables (for AI features)

The `.env.local` file already exists in the project root. Edit it with your API key:

```bash
# OpenAI API Key for AI Chatbot
OPENAI_API_KEY=your-openai-api-key-here

# Or use Anthropic Claude
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

Get your API keys:
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/

---

## Common Tasks

### Change Site Name/Info
Edit `siteConfig` in `/app/data/content.ts`

### Change Colors
Edit CSS variables in `/app/globals.css`

### Add New Section
1. Create component in `/app/components/sections/`
2. Import in `/app/page.tsx`
3. Add to the main content area

### Modify Navbar Links
Edit `navLinks` array in `/app/components/sections/Navbar.tsx`

---

## AI Chatbot Enhancement Guide

To connect the chatbot to a real AI:

1. **Create API Route** (`/app/api/chat/route.ts`):
```typescript
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI();

export async function POST(req: Request) {
  const { messages } = await req.json();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful assistant for Akhil\'s portfolio...' },
      ...messages
    ],
  });

  return NextResponse.json({
    message: completion.choices[0].message.content
  });
}
```

2. **Update AIChatbot.tsx** to use fetch:
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages }),
});
const data = await response.json();
```

---

## Checklist for New Content

### New Blog Post
- [ ] Add metadata to `content.ts` → `blogPosts`
- [ ] Add content to `blog/[slug]/page.tsx` → `posts`
- [ ] Run `npm run dev` and test both listing and detail pages

### New Travel Story
- [ ] Add metadata to `content.ts` → `travelStories`
- [ ] Add cover image to `/public/stories/`
- [ ] Add content to `stories/[slug]/page.tsx` → `stories`
- [ ] Run `npm run dev` and test both listing and detail pages

### New Project
- [ ] Add to `content.ts` → `projects`
- [ ] (Optional) Add image to `/public/projects/`

### New Testimonial
- [ ] Add to `content.ts` → `testimonials`

---

*Last updated: January 2024*
