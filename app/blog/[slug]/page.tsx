import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Blog posts content - can be moved to MDX files or a CMS
const posts: Record<string, { title: string; date: string; content: string; category: string }> = {
  'building-mvps-that-ship': {
    title: 'Building MVPs That Actually Ship',
    date: 'January 15, 2024',
    category: 'Startups',
    content: `
      <p>Coming soon...</p>
      <p>This is a placeholder for your blog post content. You can write your posts here or integrate with a CMS like Contentful, Sanity, or use MDX files.</p>
    `,
  },
  'discord-telegram-ai-bot-persistent-memory': {
    title: 'Building a Discord/Telegram AI Bot with Persistent Memory',
    date: 'January 20, 2024',
    category: 'AI',
    content: `
      <p class="lead">Ever wanted to build a chatbot that actually remembers your conversations? In this post, I'll walk you through how I created an AI-powered bot for Discord and Telegram with persistent memory - similar to how Moltbot works.</p>

      <h2>The Problem with Traditional Bots</h2>
      <p>Most chatbots are stateless. They respond to your message without any context of previous conversations. This makes interactions feel mechanical and repetitive. Users have to re-explain their preferences, context, and history every single time.</p>

      <h2>Architecture Overview</h2>
      <p>The solution involves three main components:</p>
      <ul>
        <li><strong>LLM Backend</strong> - OpenAI GPT-4 or Claude for natural language understanding</li>
        <li><strong>Vector Database</strong> - Pinecone or Weaviate for storing conversation embeddings</li>
        <li><strong>Memory Manager</strong> - Custom logic to retrieve relevant context</li>
      </ul>

      <h2>Key Implementation Steps</h2>

      <h3>1. Setting Up the Bot Framework</h3>
      <p>For Discord, we use discord.py or discord.js. For Telegram, python-telegram-bot works great. The key is to capture every message and response for storage.</p>

      <pre><code class="language-python"># Example: Discord bot setup with memory
import discord
from openai import OpenAI
from pinecone import Pinecone

client = discord.Client()
openai = OpenAI()
pc = Pinecone(api_key="your-key")
index = pc.Index("conversations")

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    # Retrieve relevant memories
    context = await get_relevant_memories(
        user_id=message.author.id,
        query=message.content
    )

    # Generate response with context
    response = await generate_response(
        message.content,
        context
    )

    # Store the interaction
    await store_memory(
        user_id=message.author.id,
        message=message.content,
        response=response
    )

    await message.channel.send(response)</code></pre>

      <h3>2. Creating Embeddings for Memory</h3>
      <p>Each conversation turn is converted into an embedding vector using OpenAI's text-embedding-ada-002 or similar models. These vectors capture the semantic meaning of the conversation.</p>

      <pre><code class="language-python">async def create_embedding(text: str) -> list:
    response = openai.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response.data[0].embedding

async def store_memory(user_id: str, message: str, response: str):
    # Create a memory entry
    memory_text = f"User: {message}\\nAssistant: {response}"
    embedding = await create_embedding(memory_text)

    # Store in vector database with metadata
    index.upsert(vectors=[{
        "id": f"{user_id}_{timestamp}",
        "values": embedding,
        "metadata": {
            "user_id": user_id,
            "message": message,
            "response": response,
            "timestamp": datetime.now().isoformat()
        }
    }])</code></pre>

      <h3>3. Retrieving Relevant Context</h3>
      <p>When a new message arrives, we search the vector database for similar past conversations. This gives the AI relevant context without loading the entire history.</p>

      <pre><code class="language-python">async def get_relevant_memories(user_id: str, query: str, k: int = 5):
    # Create embedding for the query
    query_embedding = await create_embedding(query)

    # Search for similar memories
    results = index.query(
        vector=query_embedding,
        top_k=k,
        filter={"user_id": user_id},
        include_metadata=True
    )

    # Format memories for the prompt
    memories = []
    for match in results.matches:
        memories.append({
            "message": match.metadata["message"],
            "response": match.metadata["response"],
            "relevance": match.score
        })

    return memories</code></pre>

      <h3>4. Crafting the Prompt with Memory</h3>
      <p>The magic happens in how you structure the prompt. Include relevant memories as context:</p>

      <pre><code class="language-python">async def generate_response(message: str, memories: list) -> str:
    # Build context from memories
    context = "Previous relevant conversations:\\n"
    for memory in memories:
        context += f"- User asked: {memory['message']}\\n"
        context += f"  You responded: {memory['response']}\\n\\n"

    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": f"""You are a helpful assistant with memory.

{context}

Use this context to provide personalized, consistent responses.
Remember user preferences and past discussions."""
            },
            {"role": "user", "content": message}
        ]
    )

    return response.choices[0].message.content</code></pre>

      <h2>Advanced Features</h2>

      <h3>Memory Summarization</h3>
      <p>Over time, the memory database grows large. Implement periodic summarization to condense old memories into key facts about each user.</p>

      <h3>Memory Categories</h3>
      <p>Tag memories by type: preferences, facts, conversations, tasks. This allows for more targeted retrieval.</p>

      <h3>Forgetting Mechanism</h3>
      <p>Implement decay or explicit "forget" commands so users can manage what the bot remembers.</p>

      <h2>Deployment Considerations</h2>
      <ul>
        <li><strong>Rate Limiting</strong> - Protect against API costs from spam</li>
        <li><strong>Privacy</strong> - Allow users to delete their data</li>
        <li><strong>Fallback</strong> - Handle API failures gracefully</li>
        <li><strong>Costs</strong> - Monitor embedding and LLM costs closely</li>
      </ul>

      <h2>Tech Stack Summary</h2>
      <ul>
        <li>Python 3.11+ with asyncio</li>
        <li>discord.py / python-telegram-bot</li>
        <li>OpenAI API (GPT-4 + Embeddings)</li>
        <li>Pinecone / Weaviate for vector storage</li>
        <li>Redis for caching recent context</li>
        <li>PostgreSQL for user settings</li>
      </ul>

      <h2>Next Steps</h2>
      <p>Want to take this further? Consider:</p>
      <ul>
        <li>Adding multi-modal memory (images, files)</li>
        <li>Implementing RAG for knowledge bases</li>
        <li>Creating personality profiles based on interaction patterns</li>
        <li>Building a web dashboard for memory management</li>
      </ul>

      <p>If you're interested in building something like this for your community or business, <a href="/#contact">let's chat</a>!</p>
    `,
  },
  'automating-workflows-with-ai': {
    title: 'Automating Workflows with AI',
    date: 'December 20, 2023',
    category: 'AI',
    content: `
      <p>Coming soon...</p>
      <p>This is a placeholder for your blog post content.</p>
    `,
  },
  'tech-stack-2024': {
    title: 'The Tech Stack I Use in 2024',
    date: 'November 10, 2023',
    category: 'Tech',
    content: `
      <p>Coming soon...</p>
      <p>This is a placeholder for your blog post content.</p>
    `,
  },
  'ecommerce-integration-patterns': {
    title: 'E-commerce Integration Patterns',
    date: 'October 5, 2023',
    category: 'Tech',
    content: `
      <p>Coming soon...</p>
      <p>This is a placeholder for your blog post content.</p>
    `,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} — Akhil`,
    description: post.title,
  };
}

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen text-theme relative">
      <article className="max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-32">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-theme-muted hover:text-theme transition-colors mb-12 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 text-xs font-medium text-indigo-400 bg-indigo-500/10 rounded-md">
              {post.category}
            </span>
            <span className="text-sm text-theme-muted">{post.date}</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-theme">
            {post.title}
          </h1>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-display prose-headings:text-theme prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-theme-secondary prose-p:leading-relaxed
            prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-theme prose-strong:font-semibold
            prose-ul:text-theme-secondary prose-li:my-1
            prose-code:text-indigo-400 prose-code:bg-theme-card prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-theme-secondary prose-pre:border prose-pre:border-theme prose-pre:rounded-xl
            [&_.lead]:text-xl [&_.lead]:text-theme-secondary [&_.lead]:leading-relaxed [&_.lead]:mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
