import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendTelegramNotification } from '@/app/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, company, content, mathAnswer, expectedAnswer, honeypot } = body;

    // Bot check 1: Honeypot field should be empty
    if (honeypot) {
      return NextResponse.json(
        { error: 'Spam detected' },
        { status: 400 }
      );
    }

    // Bot check 2: Math verification
    if (parseInt(mathAnswer) !== expectedAnswer) {
      return NextResponse.json(
        { error: 'Incorrect verification answer' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and testimonial content are required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitize = (str: string) => str.slice(0, 500).trim();

    const testimonial = {
      id: Date.now().toString(),
      name: sanitize(name),
      role: sanitize(role || ''),
      company: sanitize(company || ''),
      content: sanitize(content),
      submittedAt: new Date().toISOString(),
      approved: false,
    };

    // Store in pending testimonials file
    const pendingPath = path.join(process.cwd(), 'data', 'pending-testimonials.json');

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read existing pending testimonials
    let pending: typeof testimonial[] = [];
    if (fs.existsSync(pendingPath)) {
      const data = fs.readFileSync(pendingPath, 'utf-8');
      pending = JSON.parse(data);
    }

    // Add new testimonial
    pending.push(testimonial);

    // Save back to file
    fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));

    // Send Telegram notification
    await sendTelegramNotification({
      type: 'testimonial',
      data: {
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        content: testimonial.content,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your testimonial has been submitted for review.',
    });
  } catch (error) {
    console.error('Testimonial submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit testimonial' },
      { status: 500 }
    );
  }
}
