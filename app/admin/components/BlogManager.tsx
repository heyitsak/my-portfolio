'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  published: boolean;
  content: string;
}

export function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNew = () => {
    setCurrentPost({
      slug: '',
      title: '',
      excerpt: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Development',
      readTime: '5 min read',
      published: false,
      content: '',
    });
    setIsEditing(true);
    setShowPreview(false);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost({ ...post });
    setIsEditing(true);
    setShowPreview(false);
  };

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea || !currentPost) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const newContent =
      textarea.value.substring(0, start) +
      before +
      textToInsert +
      after +
      textarea.value.substring(end);

    setCurrentPost({ ...currentPost, content: newContent });

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSave = async () => {
    if (!currentPost) return;

    // Auto-generate slug from title if empty
    if (!currentPost.slug) {
      currentPost.slug = currentPost.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(currentPost),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Post saved successfully!' });
        setIsEditing(false);
        fetchPosts();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save post' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save post' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/posts?slug=${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Post deleted successfully!' });
        fetchPosts();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete post' });
    }
  };

  if (isEditing && currentPost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-white">
            {currentPost.slug ? 'Edit Post' : 'New Post'}
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
              <input
                type="text"
                value={currentPost.title}
                onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                placeholder="Enter post title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Slug (URL)</label>
              <input
                type="text"
                value={currentPost.slug}
                onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                placeholder="auto-generated-from-title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt</label>
              <textarea
                value={currentPost.excerpt}
                onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Brief description for previews..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  value={currentPost.category}
                  onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Development">Development</option>
                  <option value="AI">AI</option>
                  <option value="Automation">Automation</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Thoughts">Thoughts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Read Time</label>
                <input
                  type="text"
                  value={currentPost.readTime}
                  onChange={(e) => setCurrentPost({ ...currentPost, readTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="5 min read"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPost.published}
                  onChange={(e) => setCurrentPost({ ...currentPost, published: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
              <span className="text-sm text-gray-400">
                {currentPost.published ? 'Published' : 'Draft'}
              </span>
            </div>

            {/* Markdown Help */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-sm font-medium text-white mb-2">Markdown Tips</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li><code className="bg-white/10 px-1 rounded">## Heading</code> - Section heading</li>
                <li><code className="bg-white/10 px-1 rounded">**bold**</code> - Bold text</li>
                <li><code className="bg-white/10 px-1 rounded">`code`</code> - Inline code</li>
                <li><code className="bg-white/10 px-1 rounded">```js code```</code> - Code block</li>
                <li><code className="bg-white/10 px-1 rounded">- item</code> - Bullet list</li>
                <li><code className="bg-white/10 px-1 rounded">[text](url)</code> - Link</li>
                <li><code className="bg-white/10 px-1 rounded">![alt](url)</code> - Image</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Content Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-400">Content (Markdown)</label>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  showPreview ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>

            {/* Formatting Toolbar */}
            {!showPreview && (
              <div className="flex flex-wrap gap-1 p-2 bg-white/5 rounded-lg border border-white/10">
                <button
                  onClick={() => insertMarkdown('## ', '', 'Heading')}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors"
                  title="Heading"
                >
                  H2
                </button>
                <button
                  onClick={() => insertMarkdown('### ', '', 'Subheading')}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors"
                  title="Subheading"
                >
                  H3
                </button>
                <button
                  onClick={() => insertMarkdown('**', '**', 'bold')}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors font-bold"
                  title="Bold"
                >
                  B
                </button>
                <button
                  onClick={() => insertMarkdown('*', '*', 'italic')}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors italic"
                  title="Italic"
                >
                  I
                </button>
                <button
                  onClick={() => insertMarkdown('`', '`', 'code')}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors font-mono"
                  title="Inline Code"
                >
                  {'</>'}
                </button>
                <button
                  onClick={() => insertMarkdown('\n```javascript\n', '\n```\n', '// code here')}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors"
                  title="Code Block"
                >
                  Code
                </button>
                <button
                  onClick={() => insertMarkdown('\n- ', '', 'List item')}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors"
                  title="Bullet List"
                >
                  • List
                </button>
                <button
                  onClick={() => insertMarkdown('\n1. ', '', 'List item')}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors"
                  title="Numbered List"
                >
                  1. List
                </button>
                <button
                  onClick={() => insertMarkdown('[', '](url)', 'link text')}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors"
                  title="Link"
                >
                  Link
                </button>
                <button
                  onClick={() => insertMarkdown('![', '](image-url)', 'alt text')}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors"
                  title="Image"
                >
                  Image
                </button>
                <button
                  onClick={() => insertMarkdown('\n> ', '', 'Quote')}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors"
                  title="Blockquote"
                >
                  Quote
                </button>
                <button
                  onClick={() => insertMarkdown('\n---\n', '', '')}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors"
                  title="Horizontal Rule"
                >
                  —
                </button>
              </div>
            )}

            {showPreview ? (
              <div className="h-[500px] overflow-y-auto p-4 rounded-lg bg-white/5 border border-white/10 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentPost.content || '*No content yet...*'}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={currentPost.content}
                onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                className="w-full h-[500px] px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Write your post content in Markdown...

## Example Heading

This is a paragraph with **bold** and *italic* text.

- Bullet point 1
- Bullet point 2

```javascript
const example = 'code block';
```
"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !currentPost.title}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-medium rounded-lg transition-all"
          >
            {isSaving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Blog Posts</h2>
          <p className="text-gray-400 mt-1">Create and manage your blog content</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-gray-400">No blog posts yet</p>
          <button
            onClick={handleNew}
            className="mt-4 text-indigo-400 hover:text-indigo-300"
          >
            Create your first post →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-white">{post.title}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-white/10 text-gray-400 rounded-full">
                    {post.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{post.excerpt}</p>
                <p className="text-xs text-gray-600 mt-1">{post.date} · {post.readTime}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="View"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(post.slug)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
