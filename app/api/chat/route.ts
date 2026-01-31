import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === 'your-openai-api-key-here') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant for Akhil's portfolio website. You help visitors learn about Akhil's services, experience, and how to get in touch.

Key information about Akhil:
- Freelance software engineer
- Experience at Rakuten and AWS
- Services: MVP development, e-commerce websites, mobile apps, technical consulting
- Tech stack: React, Next.js, Node.js, Python, PostgreSQL, AWS, Shopify, Stripe
- Available for freelance projects

Be friendly, concise, and helpful. If asked about pricing, suggest they reach out directly via the contact section. Keep responses brief but informative.`,
          },
          ...messages.map((msg: { role: string; content: string }) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const message = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
