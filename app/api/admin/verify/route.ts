import { NextRequest, NextResponse } from 'next/server';
import { activeTokens } from '../login/route';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (token && activeTokens.has(token)) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false });
  } catch {
    return NextResponse.json({ valid: false });
  }
}
