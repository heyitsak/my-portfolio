import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Simple token generation
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Store active tokens (in production, use Redis or database)
const activeTokens = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin password not configured' },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      const token = generateToken();
      activeTokens.add(token);

      // Auto-expire token after 24 hours
      setTimeout(() => {
        activeTokens.delete(token);
      }, 24 * 60 * 60 * 1000);

      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

// Export for use in other routes
export { activeTokens };
