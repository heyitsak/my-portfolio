# Portfolio - How to Add Content

Blog posts and stories use **MDX** (Markdown) - clean and easy to write!

---

## Structure

```
/app/
├── blog/
│   ├── _posts/              ← BLOG POSTS (MDX files)
│   │   ├── _template.mdx    ← Copy this to create a post
│   │   ├── my-post.mdx
│   │   └── index.ts         (don't edit)
│   └── ...
│
├── stories/
│   ├── _posts/              ← TRAVEL STORIES (MDX files)
│   │   ├── _template.mdx    ← Copy this to create a story
│   │   ├── my-story.mdx
│   │   └── index.ts         (don't edit)
│   └── ...
│
└── data/
    └── content.ts           ← Site config, services, testimonials
```

---

## Adding a Blog Post

1. Copy `app/blog/_posts/_template.mdx`
2. Rename to `your-post-name.mdx`
3. Edit the content
4. Done! (Auto-detected)

### Example: `app/blog/_posts/my-new-post.mdx`

```mdx
---
title: "My Post Title"
excerpt: "Short description for listing."
category: "Tech"
date: "Jan 15, 2024"
readTime: "5 min read"
featured: false
---

Your intro paragraph goes here.

## First Section

Write normally in markdown!

- Bullet points
- Work great

## Code Examples

```javascript
const hello = "world";
```

[Links](/#contact) work like this.
```

---

## Adding a Travel Story

1. Copy `app/stories/_posts/_template.mdx`
2. Rename to `your-story-name.mdx`
3. Add image to `/public/stories/`
4. Edit the content
5. Done!

### Example: `app/stories/_posts/my-trip.mdx`

```mdx
---
title: "My Amazing Trip"
excerpt: "Short description."
location: "Paris, France"
date: "Summer 2024"
image: "/stories/paris.jpg"
---

Your story starts here...

## The Journey

Describe what happened.

## Highlights

Best moments!
```

---

## Markdown Syntax

| Syntax | Result |
|--------|--------|
| `# Heading` | Main heading |
| `## Heading` | Section heading |
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `[link](url)` | Link |
| `- item` | Bullet list |
| `1. item` | Numbered list |
| `` `code` `` | Inline code |
| ` ``` ` | Code block |
| `> quote` | Blockquote |

---

## Other Content

Edit `/app/data/content.ts` for:
- Site name & social links (`siteConfig`)
- Services (`services`)
- Projects (`projects`)
- Testimonials (`testimonials`)
- About section (`aboutContent`)

---

## Commands

```bash
npm run dev    # Development
npm run build  # Production build
```

---

## File Naming

The filename becomes the URL:
- `my-post.mdx` → `/blog/my-post`
- `japan-trip.mdx` → `/stories/japan-trip`

Use lowercase with dashes, no spaces.
