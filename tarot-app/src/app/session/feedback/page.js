'use client';
export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function FeedbackContent() {
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cookie se token read karne ka helper
  const getCookie = (name) => {
    if (typeof window === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setErrorMsg("Please select a rating before submitting!");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const token = getCookie('token') || getCookie('jwt');

      if (!token) {
        throw new Error("Authentication token not found in cookies! Please log in again.");
      }

      const backendBase = process.env.NEXT_PUBLIC_API_BACKEND_URL || '';
      
      const response = await fetch(`${backendBase}/api/review/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // orderId aur astrologerId ka lafda khatam, ab sirf rating aur comment jayega
        body: JSON.stringify({ 
          rating, 
          comment: review 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      router.push('/');
    } catch (err) {
      console.error('Feedback submission failed:', err);
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#07030e] p-4 text-white overflow-hidden">
      {/* Background Ambient Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-purple-500/20 bg-[#0c0617]/80 p-8 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-amber-500/30 border border-purple-500/30 text-amber-300 text-2xl mb-4 shadow-inner">
            ✨
          </div>
          <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-amber-200 via-purple-200 to-white bg-clip-text text-transparent">
            Session Completed
          </h2>
          <p className="mt-1.5 text-xs font-medium text-purple-400/80 tracking-wider uppercase">
            Share Your Experience
          </p>
        </div>

        {/* Error Message Box */}
        {errorMsg && (
          <div className="mt-5 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs font-medium text-red-400 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Star Rating Section */}
          <div className="flex flex-col items-center rounded-2xl border border-purple-900/40 bg-[#130b22]/60 p-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3">
              Rate Your Experience
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className={`text-3xl transition-all duration-200 cursor-pointer transform hover:scale-125 ${
                    star <= (hover || rating) 
                      ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                      : 'text-gray-600/80 hover:text-gray-400'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-xs font-medium text-purple-400/90 h-4">
              {rating > 0 ? (
                <span className="text-amber-300 font-semibold">
                  {rating === 5 ? '🌟 Exceptional Reading!' : rating === 4 ? '✨ Great Insight!' : rating === 3 ? '💫 Good Session' : rating === 2 ? '⚡ Fair' : '⚠️ Needs Improvement'}
                </span>
              ) : (
                'Tap a star to rate'
              )}
            </p>
          </div>

          {/* Review Textarea */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-2">
              Your Review <span className="text-purple-500 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="How was your spiritual reading with Kripalini Tarot..."
              className="w-full rounded-2xl border border-purple-800/40 bg-[#160e28]/80 p-3.5 text-sm text-gray-100 placeholder-purple-400/40 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(147,51,234,0.3)] transition-all duration-300 hover:opacity-95 hover:shadow-[0_6px_25px_rgba(245,158,11,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Submitting Feedback...
              </span>
            ) : (
              'Submit Feedback ✨'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SessionFeedbackPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#07030e] text-purple-400 font-medium tracking-wider">Loading Mystical Space...</div>}>
      <FeedbackContent />
    </Suspense>
  );
}