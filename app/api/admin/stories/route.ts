import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { activeTokens } from '../login/route';

const STORIES_DIR = path.join(process.cwd(), 'app/stories/_posts');

interface Story {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  location: string;
  coverImage: string;
  images: string[];
  published: boolean;
  content: string;
}

async function getStories(): Promise<Story[]> {
  try {
    const files = await fs.readdir(STORIES_DIR);
    const mdxFiles = files.filter(f => f.endsWith('.mdx') && !f.startsWith('_'));

    const stories = await Promise.all(
      mdxFiles.map(async (filename) => {
        const slug = filename.replace('.mdx', '');
        const filePath = path.join(STORIES_DIR, filename);
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || '',
          excerpt: data.excerpt || '',
          date: data.date || '',
          location: data.location || '',
          coverImage: data.coverImage || '',
          images: data.images || [],
          published: data.published !== false,
          content,
        };
      })
    );

    return stories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

async function saveStory(story: Story): Promise<void> {
  const frontmatter = {
    title: story.title,
    excerpt: story.excerpt,
    date: story.date,
    location: story.location,
    coverImage: story.coverImage,
    images: story.images,
    published: story.published,
  };

  const fileContent = matter.stringify(story.content, frontmatter);
  const filePath = path.join(STORIES_DIR, `${story.slug}.mdx`);
  await fs.writeFile(filePath, fileContent);
}

function verifyToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  return token ? activeTokens.has(token) : false;
}

// GET - List all stories
export async function GET() {
  try {
    const stories = await getStories();
    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Failed to get stories:', error);
    return NextResponse.json({ error: 'Failed to get stories' }, { status: 500 });
  }
}

// POST - Create or update story
export async function POST(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const story: Story = await request.json();

    if (!story.slug || !story.title) {
      return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
    }

    await saveStory(story);

    return NextResponse.json({ success: true, story });
  } catch (error) {
    console.error('Failed to save story:', error);
    return NextResponse.json({ error: 'Failed to save story' }, { status: 500 });
  }
}

// DELETE - Delete story
export async function DELETE(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const filePath = path.join(STORIES_DIR, `${slug}.mdx`);
    await fs.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete story:', error);
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
  }
}
