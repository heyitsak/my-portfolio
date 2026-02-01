'use client';

import { useState, useMemo } from 'react';
import { testimonials } from '@/app/data/content';
import { ScrollReveal } from '@/app/components/ui/ScrollReveal';
import { SectionHeading } from '@/app/components/ui/SectionHeading';

// Generate a simple math problem for verification
function generateMathProblem() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { question: `${a} + ${b}`, answer: a + b };
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    mathAnswer: '',
    honeypot: '', // Hidden field for bots
  });

  // Generate math problem once
  const mathProblem = useMemo(() => generateMathProblem(), [showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/testimonial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expectedAnswer: mathProblem.answer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        role: '',
        company: '',
        content: '',
        mathAnswer: '',
        honeypot: '',
      });

      // Hide form after success
      setTimeout(() => {
        setShowForm(false);
        setSubmitStatus('idle');
      }, 3000);
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollReveal>
      <section id="testimonials" className="mb-40 scroll-mt-24">
        <SectionHeading>What People Say</SectionHeading>

        <div className="relative">
          {/* Main testimonial display */}
          <div className="relative bg-theme-card border border-theme rounded-2xl p-8 md:p-12 mb-8">
            {/* Quote icon */}
            <svg
              className="absolute top-6 left-6 w-12 h-12 text-indigo-500/20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <div className="relative">
              {/* Testimonial content */}
              <blockquote className="text-lg md:text-xl text-theme-secondary leading-relaxed mb-8 pl-8">
                "{testimonials[activeIndex].content}"
              </blockquote>

              {/* Author info */}
              <div className="flex items-center gap-4 pl-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-display font-bold">
                  {testimonials[activeIndex].name.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-semibold text-theme">
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="text-sm text-theme-muted">
                    {testimonials[activeIndex].role} at {testimonials[activeIndex].company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-indigo-500 w-8'
                    : 'bg-theme-card hover:bg-theme-muted'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* All testimonials grid for larger screens */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                index === activeIndex
                  ? 'bg-indigo-500/10 border-indigo-500/30'
                  : 'bg-theme-card border-theme hover:border-indigo-500/20'
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <p className="text-sm text-theme-secondary mb-4 line-clamp-3">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-theme">{testimonial.name}</p>
                  <p className="text-xs text-theme-muted">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add testimonial button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 rounded-xl transition-all duration-300 hover:bg-indigo-500/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {showForm ? 'Cancel' : 'Share Your Experience'}
          </button>
        </div>

        {/* Testimonial submission form */}
        {showForm && (
          <div className="mt-8 bg-theme-card border border-theme rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-display font-semibold text-theme mb-6">
              Share Your Testimonial
            </h3>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-theme font-medium">Thank you!</p>
                <p className="text-theme-muted text-sm mt-1">Your testimonial has been submitted for review.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field - hidden from users, bots will fill it */}
                <input
                  type="text"
                  name="website"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-theme-muted mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-theme border border-theme text-theme placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-theme-muted mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-theme border border-theme text-theme placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="Acme Inc"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-muted mb-2">
                    Your Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-theme border border-theme text-theme placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="CEO, Developer, Designer..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-muted mb-2">
                    Your Testimonial *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-theme border border-theme text-theme placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                    placeholder="Share your experience working together..."
                  />
                </div>

                {/* Human verification */}
                <div className="bg-theme rounded-xl p-4 border border-theme">
                  <label className="block text-sm font-medium text-theme mb-2">
                    Quick verification: What is {mathProblem.question}? *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.mathAnswer}
                    onChange={(e) => setFormData({ ...formData, mathAnswer: e.target.value })}
                    className="w-24 px-4 py-2 rounded-lg bg-theme-card border border-theme text-theme text-center focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="?"
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {errorMessage}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <p className="text-xs text-theme-muted">
                    Testimonials are reviewed before publishing
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-medium rounded-xl transition-all duration-300"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </section>
    </ScrollReveal>
  );
}
