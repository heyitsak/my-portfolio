'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Story {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  location: string;
  coverImage: string;
  images: string[];
  published: boolean;
  content: string;
}

export function StoriesManager() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/admin/stories');
      const data = await res.json();
      setStories(data.stories || []);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNew = () => {
    setCurrentStory({
      slug: '',
      title: '',
      excerpt: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      coverImage: '/stories/placeholder.jpg',
      images: [],
      published: false,
      content: '',
    });
    setIsEditing(true);
    setShowPreview(false);
  };

  const handleEdit = (story: Story) => {
    setCurrentStory({ ...story });
    setIsEditing(true);
    setShowPreview(false);
  };

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea || !currentStory) return;

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

    setCurrentStory({ ...currentStory, content: newContent });

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSave = async () => {
    if (!currentStory) return;

    if (!currentStory.slug) {
      currentStory.slug = currentStory.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(currentStory),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Story saved successfully!' });
        setIsEditing(false);
        fetchStories();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save story' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save story' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/stories?slug=${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Story deleted successfully!' });
        fetchStories();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete story' });
    }
  };

  if (isEditing && currentStory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-white">
            {currentStory.slug ? 'Edit Story' : 'New Story'}
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
              <input
                type="text"
                value={currentStory.title}
                onChange={(e) => setCurrentStory({ ...currentStory, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                placeholder="Enter story title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Slug (URL)</label>
              <input
                type="text"
                value={currentStory.slug}
                onChange={(e) => setCurrentStory({ ...currentStory, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                placeholder="auto-generated-from-title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt</label>
              <textarea
                value={currentStory.excerpt}
                onChange={(e) => setCurrentStory({ ...currentStory, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Brief description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                <input
                  type="text"
                  value={currentStory.location}
                  onChange={(e) => setCurrentStory({ ...currentStory, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g., Tokyo, Japan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                <input
                  type="date"
                  value={currentStory.date}
                  onChange={(e) => setCurrentStory({ ...currentStory, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image URL</label>
              <input
                type="text"
                value={currentStory.coverImage}
                onChange={(e) => setCurrentStory({ ...currentStory, coverImage: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                placeholder="/stories/image.jpg"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentStory.published}
                  onChange={(e) => setCurrentStory({ ...currentStory, published: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
              <span className="text-sm text-gray-400">
                {currentStory.published ? 'Published' : 'Draft'}
              </span>
            </div>

            {/* Markdown Help */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-sm font-medium text-white mb-2">Markdown Tips</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li><code className="bg-white/10 px-1 rounded">## Heading</code> - Section heading</li>
                <li><code className="bg-white/10 px-1 rounded">**bold**</code> - Bold text</li>
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
                  onClick={() => insertMarkdown('\n- ', '', 'List item')}
                  className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors"
                  title="Bullet List"
                >
                  • List
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
              </div>
            )}

            {showPreview ? (
              <div className="h-[400px] overflow-y-auto p-4 rounded-lg bg-white/5 border border-white/10 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentStory.content || '*No content yet...*'}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={currentStory.content}
                onChange={(e) => setCurrentStory({ ...currentStory, content: e.target.value })}
                className="w-full h-[400px] px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Write your story content in Markdown...

## Example Heading

This is a paragraph with **bold** and *italic* text.

- Point 1
- Point 2

![Image description](image-url)
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
            disabled={isSaving || !currentStory.title}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-medium rounded-lg transition-all"
          >
            {isSaving ? 'Saving...' : 'Save Story'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Stories</h2>
          <p className="text-gray-400 mt-1">Create and manage your photo stories</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Story
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
      ) : stories.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-gray-400">No stories yet</p>
          <button
            onClick={handleNew}
            className="mt-4 text-indigo-400 hover:text-indigo-300"
          >
            Create your first story →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.map((story) => (
            <div
              key={story.slug}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
            >
              <div className="aspect-video bg-gray-800 relative">
                {story.coverImage && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                )}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${story.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {story.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h3 className="font-medium text-white mt-1">{story.title}</h3>
                  <p className="text-xs text-gray-400">{story.location} · {story.date}</p>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <p className="text-sm text-gray-500 truncate flex-1">{story.excerpt}</p>
                <div className="flex items-center gap-1 ml-2">
                  <a
                    href={`/stories/${story.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="View"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <button
                    onClick={() => handleEdit(story)}
                    className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(story.slug)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
