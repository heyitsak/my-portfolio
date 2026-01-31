import { BlogPost } from './index';

const post: BlogPost = {
  title: 'Building MVPs That Actually Ship',
  excerpt: 'Lessons learned from launching multiple products on tight timelines. Focus, simplicity, and knowing when to cut scope.',
  category: 'Startups',
  date: 'Jan 15, 2024',
  readTime: '6 min read',
  featured: false,

  content: `
    <p class="lead">After helping launch dozens of MVPs, I've learned that the hardest part isn't building—it's deciding what NOT to build.</p>

    <h2>The MVP Trap</h2>
    <p>Most founders want their "minimum" viable product to have every feature. This is a recipe for never shipping.</p>

    <h2>The One-Feature Rule</h2>
    <p>The best MVPs solve ONE problem exceptionally well:</p>
    <ul>
      <li>Dropbox started as just file syncing</li>
      <li>Twitter was just 140-character updates</li>
      <li>Stripe was just a simple payment API</li>
    </ul>

    <h2>My MVP Framework</h2>
    <ol>
      <li><strong>Define the core loop:</strong> What's the one action users must take?</li>
      <li><strong>Remove everything else:</strong> If it doesn't serve the core loop, cut it</li>
      <li><strong>Set a ship date:</strong> Work backwards from a fixed deadline</li>
      <li><strong>Launch ugly:</strong> A shipped product beats a perfect mockup</li>
    </ol>

    <h2>Real Example</h2>
    <p>I helped a client launch an e-commerce MVP in 3 weeks by cutting user accounts, search, reviews, and wishlists. They validated their market in 3 weeks instead of 3 months.</p>

    <p>Ready to ship your MVP? <a href="/#contact">Let's talk</a>.</p>
  `,
};

export default post;
