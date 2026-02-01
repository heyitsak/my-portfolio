'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const components: Components = {
    // Headings with proper spacing and styling
    h1: ({ children }) => (
      <h1 className="font-display text-3xl md:text-4xl font-bold text-theme mt-16 mb-6 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-2xl md:text-3xl font-bold text-theme mt-14 mb-5 pb-3 border-b border-white/10">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-xl md:text-2xl font-semibold text-theme mt-10 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-display text-lg md:text-xl font-semibold text-theme mt-8 mb-3">
        {children}
      </h4>
    ),

    // Paragraphs with good readability
    p: ({ children }) => (
      <p className="text-theme-secondary text-base md:text-lg leading-relaxed md:leading-8 mb-6">
        {children}
      </p>
    ),

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-400/30 hover:decoration-indigo-400 transition-colors"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),

    // Strong/Bold text
    strong: ({ children }) => (
      <strong className="font-semibold text-theme">{children}</strong>
    ),

    // Emphasis/Italic
    em: ({ children }) => (
      <em className="italic text-theme-secondary">{children}</em>
    ),

    // Unordered lists
    ul: ({ children }) => (
      <ul className="my-6 ml-1 space-y-3">
        {children}
      </ul>
    ),

    // Ordered lists
    ol: ({ children }) => (
      <ol className="my-6 ml-1 space-y-3 list-decimal list-inside">
        {children}
      </ol>
    ),

    // List items
    li: ({ children }) => (
      <li className="text-theme-secondary text-base md:text-lg leading-relaxed flex items-start gap-3">
        <span className="text-indigo-400 mt-2 flex-shrink-0">•</span>
        <span>{children}</span>
      </li>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="my-8 pl-6 border-l-4 border-indigo-500 bg-indigo-500/5 py-4 pr-4 rounded-r-lg">
        <div className="text-theme-secondary italic text-lg">{children}</div>
      </blockquote>
    ),

    // Inline code
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match;

      if (isInline) {
        return (
          <code className="px-2 py-1 text-sm font-mono bg-white/5 text-pink-400 rounded-md border border-white/10" {...props}>
            {children}
          </code>
        );
      }

      // Code blocks with syntax highlighting
      return (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: '0.75rem',
            padding: '1.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.7',
            background: '#1e1e2e',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            },
          }}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    },

    // Pre (code block wrapper)
    pre: ({ children }) => (
      <div className="my-8 rounded-xl overflow-hidden border border-white/10 shadow-lg">
        {/* Code block header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1e1e2e] border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 text-xs text-theme-muted font-mono">code</span>
        </div>
        {children}
      </div>
    ),

    // Tables
    table: ({ children }) => (
      <div className="my-8 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left border-collapse">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-white/5 border-b border-white/10">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-white/5">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-white/[0.02] transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-sm font-semibold text-theme">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-sm text-theme-secondary">
        {children}
      </td>
    ),

    // Horizontal rule
    hr: () => (
      <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    ),

    // Images
    img: ({ src, alt }) => (
      <figure className="my-10">
        <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt || ''}
            className="w-full h-auto"
          />
        </div>
        {alt && (
          <figcaption className="mt-3 text-center text-sm text-theme-muted">
            {alt}
          </figcaption>
        )}
      </figure>
    ),
  };

  return (
    <div className="blog-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
