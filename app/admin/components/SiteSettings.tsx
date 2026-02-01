'use client';

import { useState, useEffect } from 'react';

interface SiteConfig {
  name: string;
  description: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export function SiteSettings() {
  const [config, setConfig] = useState<SiteConfig>({
    name: '',
    description: '',
    email: '',
    github: '',
    linkedin: '',
    twitter: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-white">Site Settings</h2>
        <p className="text-gray-400 mt-1">Manage your portfolio configuration</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            Basic Info
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Brief description about yourself"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={config.email}
                onChange={(e) => setConfig({ ...config, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-6">
          <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </span>
            Social Links
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">GitHub</label>
              <input
                type="text"
                value={config.github}
                onChange={(e) => setConfig({ ...config, github: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn</label>
              <input
                type="text"
                value={config.linkedin}
                onChange={(e) => setConfig({ ...config, linkedin: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Twitter/X</label>
              <input
                type="text"
                value={config.twitter}
                onChange={(e) => setConfig({ ...config, twitter: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="pt-6 border-t border-white/10">
        <h3 className="text-lg font-display font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/api/admin/posts"
            target="_blank"
            className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-500/50 transition-all text-center"
          >
            <span className="text-2xl block mb-2">📝</span>
            <span className="text-sm text-gray-400">View Posts API</span>
          </a>
          <a
            href="/api/admin/stories"
            target="_blank"
            className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-500/50 transition-all text-center"
          >
            <span className="text-2xl block mb-2">📸</span>
            <span className="text-sm text-gray-400">View Stories API</span>
          </a>
          <a
            href="/"
            target="_blank"
            className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-500/50 transition-all text-center"
          >
            <span className="text-2xl block mb-2">🌐</span>
            <span className="text-sm text-gray-400">View Site</span>
          </a>
          <button
            onClick={() => {
              if (confirm('Clear all cached data?')) {
                sessionStorage.clear();
                window.location.reload();
              }
            }}
            className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-red-500/50 transition-all text-center"
          >
            <span className="text-2xl block mb-2">🗑️</span>
            <span className="text-sm text-gray-400">Clear Cache</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-medium rounded-lg transition-all"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
