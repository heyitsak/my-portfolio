import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { activeTokens } from '../login/route';

const POSTS_DIR = path.join(process.cwd(), 'app/blog/_posts');

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  published: boolean;
  featured?: boolean;
  content: string;
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const mdxFiles = files.filter(f => f.endsWith('.mdx') && !f.startsWith('_'));

    const posts = await Promise.all(
      mdxFiles.map(async (filename) => {
        const slug = filename.replace('.mdx', '');
        const filePath = path.join(POSTS_DIR, filename);
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || '',
          excerpt: data.excerpt || '',
          date: data.date || '',
          category: data.category || 'Development',
          readTime: data.readTime || '5 min read',
          published: data.published !== false,
          featured: data.featured || false,
          content,
        };
      })
    );

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

async function savePost(post: BlogPost): Promise<void> {
  const frontmatter = {
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    category: post.category,
    readTime: post.readTime,
    published: post.published,
    featured: post.featured || false,
  };

  const fileContent = matter.stringify(post.content, frontmatter);
  const filePath = path.join(POSTS_DIR, `${post.slug}.mdx`);
  await fs.writeFile(filePath, fileContent);
}

function verifyToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  return token ? activeTokens.has(token) : false;
}

// GET - List all posts
export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Failed to get posts:', error);
    return NextResponse.json({ error: 'Failed to get posts' }, { status: 500 });
  }
}

// POST - Create or update post
export async function POST(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const post: BlogPost = await request.json();

    if (!post.slug || !post.title) {
      return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
    }

    await savePost(post);

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Failed to save post:', error);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}

// DELETE - Delete post
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

    const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
    await fs.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
