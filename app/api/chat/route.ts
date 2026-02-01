import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Cache the knowledge base content
let knowledgeBaseCache: string | null = null;

async function getKnowledgeBase(): Promise<string> {
  if (knowledgeBaseCache) {
    return knowledgeBaseCache;
  }

  try {
    const filePath = path.join(process.cwd(), 'app/data/ai-knowledge.md');
    const content = await fs.readFile(filePath, 'utf-8');
    knowledgeBaseCache = content;
    return content;
  } catch (error) {
    console.error('Failed to read knowledge base:', error);
    return '';
  }
}

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

    // Load knowledge base
    const knowledgeBase = await getKnowledgeBase();

    const systemPrompt = `You are a helpful AI assistant for Akhil's portfolio website. You help visitors learn about Akhil's services, experience, and how to get in touch.

Use the following knowledge base to answer questions accurately:

${knowledgeBase}

Guidelines:
- Be friendly, concise, and helpful
- Answer based on the knowledge base above
- If asked something not covered, politely say you don't have that specific information and suggest contacting Akhil directly
- Keep responses brief but informative (2-3 sentences for simple questions)
- For pricing questions, explain that it depends on scope and suggest a consultation
- Always maintain a professional yet approachable tone`;

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
            content: systemPrompt,
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
