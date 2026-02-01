import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { activeTokens } from '../login/route';

const DATA_DIR = path.join(process.cwd(), 'data');
const PENDING_FILE = path.join(DATA_DIR, 'pending-testimonials.json');
const APPROVED_FILE = path.join(DATA_DIR, 'approved-testimonials.json');

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  submittedAt: string;
  approved: boolean;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getPending(): Testimonial[] {
  ensureDataDir();
  try {
    if (fs.existsSync(PENDING_FILE)) {
      return JSON.parse(fs.readFileSync(PENDING_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function getApproved(): Testimonial[] {
  ensureDataDir();
  try {
    if (fs.existsSync(APPROVED_FILE)) {
      return JSON.parse(fs.readFileSync(APPROVED_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function savePending(testimonials: Testimonial[]) {
  ensureDataDir();
  fs.writeFileSync(PENDING_FILE, JSON.stringify(testimonials, null, 2));
}

function saveApproved(testimonials: Testimonial[]) {
  ensureDataDir();
  fs.writeFileSync(APPROVED_FILE, JSON.stringify(testimonials, null, 2));
}

function verifyToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  return token ? activeTokens.has(token) : false;
}

// GET - List all testimonials
export async function GET(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pending = getPending();
    const approved = getApproved();
    return NextResponse.json({ pending, approved });
  } catch (error) {
    console.error('Failed to get testimonials:', error);
    return NextResponse.json({ error: 'Failed to get testimonials' }, { status: 500 });
  }
}

// POST - Approve or reject testimonial
export async function POST(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, action } = await request.json();

    if (!id || !action) {
      return NextResponse.json({ error: 'ID and action are required' }, { status: 400 });
    }

    const pending = getPending();
    const testimonialIndex = pending.findIndex(t => t.id === id);

    if (testimonialIndex === -1) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const testimonial = pending[testimonialIndex];

    if (action === 'approve') {
      // Move to approved
      testimonial.approved = true;
      const approved = getApproved();
      approved.unshift(testimonial);
      saveApproved(approved);
    }

    // Remove from pending (for both approve and reject)
    pending.splice(testimonialIndex, 1);
    savePending(pending);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process testimonial:', error);
    return NextResponse.json({ error: 'Failed to process testimonial' }, { status: 500 });
  }
}

// DELETE - Delete approved testimonial
export async function DELETE(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const approved = getApproved();
    const filtered = approved.filter(t => t.id !== id);
    saveApproved(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
