import { BlogPost } from './index';

const post: BlogPost = {
  title: 'Building AI Bots with Persistent Memory for Discord & Telegram',
  excerpt: 'Learn how to create intelligent chatbots that remember context across conversations using vector databases and LLMs.',
  category: 'AI',
  date: 'Jan 20, 2024',
  readTime: '8 min read',
  featured: true,

  content: `
    <p class="lead">Creating AI bots that actually remember your conversations is a game-changer for user engagement. Here's how I built persistent memory into Discord and Telegram bots.</p>

    <h2>The Problem with Stateless Bots</h2>
    <p>Most chatbots treat every message as a fresh start. They have no memory of previous interactions, which leads to frustrating user experiences.</p>

    <h2>The Solution: Vector Databases + LLMs</h2>
    <p>By combining vector databases (like Pinecone or Weaviate) with large language models, we can create bots that:</p>
    <ul>
      <li>Remember user preferences and past conversations</li>
      <li>Provide contextually relevant responses</li>
      <li>Build genuine relationships with users over time</li>
    </ul>

    <h2>Architecture Overview</h2>
    <ol>
      <li><strong>Embedding:</strong> Convert messages to vector embeddings</li>
      <li><strong>Storage:</strong> Store embeddings in a vector database</li>
      <li><strong>Retrieval:</strong> Fetch relevant context using semantic search</li>
    </ol>

    <h2>Implementation</h2>
    <pre><code class="language-typescript">
// Store conversation in vector DB
async function storeMessage(userId: string, message: string) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: message,
  });

  await vectorDB.upsert({
    id: generateId(),
    values: embedding.data[0].embedding,
    metadata: { userId, message, timestamp: Date.now() }
  });
}
    </code></pre>

    <h2>Results</h2>
    <p>User engagement increased by 3x and conversation length doubled. Users reported feeling like they were talking to a "friend who actually remembers them."</p>

    <p>Want to build something similar? <a href="/#contact">Get in touch</a>!</p>
  `,
};

export default post;
