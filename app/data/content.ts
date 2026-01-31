// ============================================
// SITE CONFIGURATION
// ============================================
export const siteConfig = {
  name: 'Akhil',
  title: 'Creative Minds — Freelance Engineer',
  description: 'Freelance engineer helping startups build MVPs, automate workflows, with a focus on shipping fast and keeping things simple.',
  email: 'your.email@example.com',
  whatsapp: '+1234567890', // Add your WhatsApp number with country code
  social: {
    github: 'https://github.com/heyitsak',
    linkedin: 'https://linkedin.com/in/akhilp1708',
    twitter: 'https://twitter.com/yourusername',
    buyMeACoffee: 'https://www.buymeacoffee.com/akhilp1708',
  },
};

// ============================================
// ABOUT SECTION
// ============================================
export const aboutContent = {
  paragraphs: [
    "I'm Akhil, a hands-on software engineer who enjoys turning ideas into working systems. I've worked in large-scale engineering environments, including organizations like Rakuten and AWS, where I've been involved in building, supporting, and monitoring production systems used in real-world scenarios.",
    "Having spent years working within established organizations and supporting running systems, I've developed a strong understanding of common problem areas complexity, operational overhead, and decisions that don't age well. This perspective helps me approach early-stage work with care, keeping things simple, practical, and easy to evolve.",
    "Alongside my regular role, I work independently as a freelance engineer, collaborating with founders and early-stage teams to turn ideas into practical MVPs. I prefer to build incrementally, learn along the way, and grow with the teams I work with focusing on solutions that deliver real value without unnecessary complexity.",
  ],
};

// ============================================
// SERVICES SECTION
// To add a new service: Copy an object and modify the values
// ============================================
export const services = [
  {
    title: 'Helping Startups Get Online with Smart Websites & AI Assistants',
    description: 'I help early-stage startups launch fast, modern websites with AI assistants that understand their business. The focus is on clarity, credibility, and helping teams get online quickly without unnecessary complexity.',
    color: 'bg-indigo-500',
  },
  {
    title: 'E-commerce Websites with Secure Payments & End-to-End Setup',
    description: 'I help businesses build complete online stores with products, shopping carts, and secure payments. The focus is on smooth checkout, easy management, and systems that are ready to scale.',
    color: 'bg-purple-500',
  },
  {
    title: 'Helping You Build Simple, Practical Mobile Applications',
    description: 'I help startups and businesses create simple mobile apps for everyday needs like forms and dashboards. The focus is on practical apps that are easy to launch and expand over time.',
    color: 'bg-blue-500',
  },
  {
    title: 'Helping Teams Handle Technical Challenges',
    description: 'I help early teams solve technical challenges like debugging, integrations, and architecture decisions. The focus is on simple, reliable solutions that scale smoothly as systems grow.',
    color: 'bg-emerald-500',
  },
];

// ============================================
// PROJECTS/WORK SECTION
// To add a new project: Copy an object and modify the values
// ============================================
export const projects = [
  {
    title: 'Startup MVP Platform',
    year: '2024',
    description: 'Built and deployed an MVP for an early-stage startup, handling backend APIs, authentication, and deployment.',
    tags: ['Next.js', 'Node.js', 'PostgreSQL'],
    image: '/projects/project-1.jpg',
    github: 'https://github.com/yourusername/project-1',
  },
  {
    title: 'E-commerce Automation',
    year: '2024',
    description: 'Integrated Shopify with payment gateways and automated order and fulfillment workflows.',
    tags: ['Shopify', 'Stripe', 'Webhooks'],
    image: '/projects/project-2.jpg',
    github: 'https://github.com/yourusername/project-2',
  },
  // Add more projects here...
];

// ============================================
// TESTIMONIALS SECTION
// To add a new testimonial: Copy an object and modify the values
// ============================================
export const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder',
    company: 'TechStart Inc',
    content: 'Akhil helped us launch our MVP in just 3 weeks. His pragmatic approach and focus on shipping quickly made all the difference for our early-stage startup.',
  },
  {
    name: 'Michael Roberts',
    role: 'CTO',
    company: 'GrowthLabs',
    content: 'Working with Akhil was a game-changer. He understood our technical challenges and delivered solutions that were both elegant and maintainable.',
  },
  {
    name: 'Priya Sharma',
    role: 'Product Manager',
    company: 'InnovateCo',
    content: 'Akhil brought clarity to our chaotic requirements. His experience with production systems shows in every decision he makes.',
  },
];

// ============================================
// BLOG POSTS
// To add a new blog post:
// 1. Add entry here with slug, title, excerpt, etc.
// 2. Create content in /app/blog/[slug]/page.tsx
// ============================================
export const blogPosts = [
  {
    slug: 'building-mvps-that-ship',
    title: 'Building MVPs That Actually Ship',
    excerpt: 'Lessons learned from helping startups go from idea to launched product in weeks, not months.',
    category: 'Startups',
    date: 'Jan 15, 2024',
    readTime: '5 min read',
  },
  {
    slug: 'discord-telegram-ai-bot-persistent-memory',
    title: 'Building a Discord/Telegram AI Bot with Persistent Memory',
    excerpt: 'How I created an intelligent bot that remembers conversations and context, similar to Moltbot.',
    category: 'AI',
    date: 'Jan 20, 2024',
    readTime: '8 min read',
    featured: true,
  },
  {
    slug: 'automating-workflows-with-ai',
    title: 'Automating Workflows with AI',
    excerpt: 'How I use AI tools to automate repetitive tasks and save hours every week.',
    category: 'AI',
    date: 'Dec 20, 2023',
    readTime: '4 min read',
  },
  {
    slug: 'tech-stack-2024',
    title: 'The Tech Stack I Use in 2024',
    excerpt: 'My go-to tools, frameworks, and services for building modern web applications.',
    category: 'Tech',
    date: 'Nov 10, 2023',
    readTime: '6 min read',
  },
  {
    slug: 'ecommerce-integration-patterns',
    title: 'E-commerce Integration Patterns',
    excerpt: 'Best practices for integrating payment gateways and managing order workflows.',
    category: 'Tech',
    date: 'Oct 5, 2023',
    readTime: '7 min read',
  },
];

// ============================================
// TRAVEL STORIES
// To add a new story:
// 1. Add entry here with slug, title, excerpt, etc.
// 2. Add images to /public/stories/
// 3. Create content in /app/stories/[slug]/page.tsx
// ============================================
export const travelStories = [
  {
    slug: 'road-trip-mountains',
    title: 'Road Trip Through the Mountains',
    excerpt: 'A weekend motorcycle trip through winding mountain roads and scenic viewpoints.',
    location: 'Western Ghats',
    date: 'December 2023',
    image: '/stories/mountains.jpg',
  },
  {
    slug: 'coastal-photography',
    title: 'Coastal Photography Session',
    excerpt: 'Capturing the golden hour at some of the most beautiful beaches.',
    location: 'Goa',
    date: 'November 2023',
    image: '/stories/coastal.jpg',
  },
  {
    slug: 'city-exploration',
    title: 'Urban Exploration',
    excerpt: 'Finding hidden gems and street photography in the city.',
    location: 'Mumbai',
    date: 'October 2023',
    image: '/stories/city.jpg',
  },
];

// ============================================
// BEYOND WORK SECTION
// ============================================
export const beyondWork = {
  text: "Outside of work, I enjoy riding motorcycles, traveling, and photography. These experiences help me stay curious, grounded, and thoughtful in how I approach building products and solving problems.",
  travelBlog: "https://yourtravelblog.com",
};

// ============================================
// CONTACT SECTION
// ============================================
export const contactContent = "If you'd like to work together, have an idea to discuss, or need help building something, feel free to reach out.";
