import { BlogPost } from './index';

const post: BlogPost = {
  title: 'Automating Business Workflows with AI',
  excerpt: 'How I helped a client save 20 hours per week by automating their repetitive tasks with custom AI solutions.',
  category: 'AI',
  date: 'Jan 10, 2024',
  readTime: '5 min read',
  featured: false,

  content: `
    <p class="lead">A recent client was spending 20+ hours weekly on repetitive data entry. Here's how we automated it all away.</p>

    <h2>The Problem</h2>
    <p>The team was manually:</p>
    <ul>
      <li>Extracting data from PDFs and emails</li>
      <li>Categorizing incoming requests</li>
      <li>Generating standardized responses</li>
      <li>Updating spreadsheets</li>
    </ul>

    <h2>The Solution</h2>
    <p>We built a custom AI pipeline that monitors incoming documents, extracts information using GPT-4, routes tasks automatically, and generates draft responses.</p>

    <h2>The Tech Stack</h2>
    <ul>
      <li><strong>n8n:</strong> Workflow automation</li>
      <li><strong>OpenAI API:</strong> Document understanding</li>
      <li><strong>Airtable:</strong> Flexible database</li>
      <li><strong>Slack:</strong> Notifications</li>
    </ul>

    <h2>Results</h2>
    <ul>
      <li>20 hours/week saved</li>
      <li>95% accuracy on data extraction</li>
      <li>Response time: hours to minutes</li>
    </ul>

    <p>Want to automate your workflows? <a href="/#contact">Reach out</a>!</p>
  `,
};

export default post;
