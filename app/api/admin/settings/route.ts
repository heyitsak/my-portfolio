import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { activeTokens } from '../login/route';

const CONTENT_FILE = path.join(process.cwd(), 'app/data/content.ts');

function verifyToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  return token ? activeTokens.has(token) : false;
}

// GET - Get current site config
export async function GET() {
  try {
    const content = await fs.readFile(CONTENT_FILE, 'utf-8');

    // Parse the siteConfig object from the file
    const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
    const descriptionMatch = content.match(/description:\s*['"]([^'"]+)['"]/);
    const emailMatch = content.match(/email:\s*['"]([^'"]+)['"]/);
    const githubMatch = content.match(/github:\s*['"]([^'"]+)['"]/);
    const linkedinMatch = content.match(/linkedin:\s*['"]([^'"]+)['"]/);
    const twitterMatch = content.match(/twitter:\s*['"]([^'"]+)['"]/);

    const config = {
      name: nameMatch?.[1] || '',
      description: descriptionMatch?.[1] || '',
      email: emailMatch?.[1] || '',
      github: githubMatch?.[1] || '',
      linkedin: linkedinMatch?.[1] || '',
      twitter: twitterMatch?.[1] || '',
    };

    return NextResponse.json({ config });
  } catch (error) {
    console.error('Failed to get settings:', error);
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 });
  }
}

// POST - Update site config
export async function POST(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newConfig = await request.json();
    let content = await fs.readFile(CONTENT_FILE, 'utf-8');

    // Update each field
    const updates: [RegExp, string][] = [
      [/name:\s*['"][^'"]*['"]/, `name: '${newConfig.name}'`],
      [/description:\s*['"][^'"]*['"]/, `description: '${newConfig.description}'`],
      [/email:\s*['"][^'"]*['"]/, `email: '${newConfig.email}'`],
      [/github:\s*['"][^'"]*['"]/, `github: '${newConfig.github}'`],
      [/linkedin:\s*['"][^'"]*['"]/, `linkedin: '${newConfig.linkedin}'`],
      [/twitter:\s*['"][^'"]*['"]/, `twitter: '${newConfig.twitter}'`],
    ];

    for (const [regex, replacement] of updates) {
      content = content.replace(regex, replacement);
    }

    await fs.writeFile(CONTENT_FILE, content);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
