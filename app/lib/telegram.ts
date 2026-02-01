// Telegram Bot Notification Helper
// To set up:
// 1. Create a bot with @BotFather on Telegram
// 2. Get your chat ID by messaging @userinfobot
// 3. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to .env.local

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface TelegramMessage {
  type: 'testimonial' | 'visitor' | 'contact';
  data: Record<string, string | number | undefined>;
}

export async function sendTelegramNotification(message: TelegramMessage): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram not configured, skipping notification');
    return false;
  }

  let text = '';

  switch (message.type) {
    case 'testimonial':
      text = `📝 *New Testimonial Received!*\n\n` +
        `👤 *Name:* ${escapeMarkdown(message.data.name as string || 'Anonymous')}\n` +
        `💼 *Role:* ${escapeMarkdown(message.data.role as string || 'N/A')}\n` +
        `🏢 *Company:* ${escapeMarkdown(message.data.company as string || 'N/A')}\n\n` +
        `💬 *Message:*\n${escapeMarkdown(message.data.content as string || '')}`;
      break;

    case 'visitor':
      text = `👀 *New Visitor!*\n\n` +
        `🌍 *Country:* ${escapeMarkdown(message.data.country as string || 'Unknown')}\n` +
        `🏙️ *City:* ${escapeMarkdown(message.data.city as string || 'Unknown')}\n` +
        `📍 *IP:* \`${message.data.ip || 'Unknown'}\`\n` +
        `🖥️ *Device:* ${escapeMarkdown(message.data.device as string || 'Unknown')}\n` +
        `🌐 *Browser:* ${escapeMarkdown(message.data.browser as string || 'Unknown')}\n` +
        `📄 *Page:* ${escapeMarkdown(message.data.page as string || '/')}\n` +
        `🔗 *Referrer:* ${escapeMarkdown(message.data.referrer as string || 'Direct')}`;
      break;

    case 'contact':
      text = `📧 *New Contact Message!*\n\n` +
        `👤 *Name:* ${escapeMarkdown(message.data.name as string || 'Anonymous')}\n` +
        `📧 *Email:* ${escapeMarkdown(message.data.email as string || 'N/A')}\n\n` +
        `💬 *Message:*\n${escapeMarkdown(message.data.message as string || '')}`;
      break;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Telegram API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}

// Escape special Markdown characters
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}
