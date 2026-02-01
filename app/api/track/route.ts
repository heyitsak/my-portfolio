import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/app/lib/telegram';

// Simple in-memory rate limiting to avoid spam
const recentVisitors = new Map<string, number>();
const RATE_LIMIT_MINUTES = 30; // Only notify once per IP every 30 minutes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, referrer, userAgent } = body;

    // Get IP from headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'Unknown';

    // Rate limiting check
    const lastVisit = recentVisitors.get(ip);
    const now = Date.now();
    if (lastVisit && now - lastVisit < RATE_LIMIT_MINUTES * 60 * 1000) {
      return NextResponse.json({ success: true, tracked: false });
    }
    recentVisitors.set(ip, now);

    // Clean up old entries (every 100 requests)
    if (recentVisitors.size > 100) {
      const cutoff = now - RATE_LIMIT_MINUTES * 60 * 1000;
      for (const [key, value] of recentVisitors.entries()) {
        if (value < cutoff) recentVisitors.delete(key);
      }
    }

    // Parse user agent for device/browser info
    const deviceInfo = parseUserAgent(userAgent || '');

    // Get geo info from IP (using free API)
    let geoData = { country: 'Unknown', city: 'Unknown' };
    if (ip !== 'Unknown' && ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`, {
          signal: AbortSignal.timeout(3000),
        });
        if (geoResponse.ok) {
          geoData = await geoResponse.json();
        }
      } catch {
        // Geo lookup failed, use defaults
      }
    }

    // Send Telegram notification
    await sendTelegramNotification({
      type: 'visitor',
      data: {
        ip,
        country: geoData.country,
        city: geoData.city,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        page: page || '/',
        referrer: referrer || 'Direct',
      },
    });

    return NextResponse.json({ success: true, tracked: true });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

function parseUserAgent(ua: string): { device: string; browser: string } {
  let device = 'Desktop';
  let browser = 'Unknown';

  // Device detection
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
    if (/iPad/i.test(ua)) {
      device = 'iPad';
    } else if (/iPhone/i.test(ua)) {
      device = 'iPhone';
    } else if (/Android/i.test(ua)) {
      device = /Mobile/i.test(ua) ? 'Android Phone' : 'Android Tablet';
    } else {
      device = 'Mobile';
    }
  } else if (/Macintosh/i.test(ua)) {
    device = 'Mac';
  } else if (/Windows/i.test(ua)) {
    device = 'Windows PC';
  } else if (/Linux/i.test(ua)) {
    device = 'Linux';
  }

  // Browser detection
  if (/Edg\//i.test(ua)) {
    browser = 'Edge';
  } else if (/Chrome/i.test(ua)) {
    browser = 'Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Safari';
  } else if (/Firefox/i.test(ua)) {
    browser = 'Firefox';
  } else if (/Opera|OPR/i.test(ua)) {
    browser = 'Opera';
  }

  return { device, browser };
}
