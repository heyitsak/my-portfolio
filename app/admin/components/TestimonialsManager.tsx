'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  submittedAt: string;
  approved: boolean;
}

export function TestimonialsManager() {
  const [pending, setPending] = useState<Testimonial[]>([]);
  const [approved, setApproved] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch('/api/admin/testimonials', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setPending(data.pending || []);
      setApproved(data.approved || []);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id, action: 'approve' }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Testimonial approved!' });
        fetchTestimonials();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to approve testimonial' });
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this testimonial?')) return;

    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id, action: 'reject' }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Testimonial rejected' });
        fetchTestimonials();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to reject testimonial' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Testimonial deleted' });
        fetchTestimonials();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete testimonial' });
    }
  };

  const testimonials = activeTab === 'pending' ? pending : approved;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Testimonials</h2>
          <p className="text-gray-400 mt-1">Review and manage client testimonials</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'pending'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Pending ({pending.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'approved'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Approved ({approved.length})
          </button>
        </div>
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
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-gray-400">
            {activeTab === 'pending'
              ? 'No pending testimonials'
              : 'No approved testimonials yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 bg-white/5 border border-white/10 rounded-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}{testimonial.company && ` at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                  <p className="text-xs text-gray-600 mt-3">
                    Submitted {new Date(testimonial.submittedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {activeTab === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(testimonial.id)}
                        className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(testimonial.id)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </button>
                    </>
                  )}
                  {activeTab === 'approved' && (
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
