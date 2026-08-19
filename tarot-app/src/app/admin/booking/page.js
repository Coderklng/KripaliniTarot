'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Loader2, Calendar, User, Clock, CheckCircle2, AlertCircle, Sparkles, RefreshCw, ShieldAlert, X, FileText, CreditCard, Mail, Phone } from 'lucide-react';

export default function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null); // Modal ke liye state

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get admin token from cookies
      const token = Cookies.get('admin');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/transactions/all`, {
        method: 'GET',
        headers: { "Authorization": `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch bookings');
      }

      setBookings(result.data || result.bookings || result);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.message || 'Something went wrong while fetching bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => (b.status || 'pending') === 'pending').length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-[#0c0a1d] min-h-screen text-white relative overflow-hidden">
      
      {/* Background Ambient glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-[#141026]/90 backdrop-blur-2xl border border-purple-500/20 rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative z-10">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.15)]">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-amber-100 tracking-wide font-medium">Tarot Reading Queue</h2>
              <p className="text-xs text-purple-300/60 mt-0.5">Click on any user card to view detailed order & transaction info</p>
            </div>
          </div>

          <button 
            onClick={fetchBookings}
            disabled={loading}
            className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-4 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#1e1738]/40 border border-purple-500/15 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-purple-300/60 font-medium">Total Requests</p>
              <h3 className="text-xl font-bold text-white mt-1">{totalBookings}</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-300">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-[#1e1738]/40 border border-amber-500/15 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-amber-300/60 font-medium">Pending Readings</p>
              <h3 className="text-xl font-bold text-amber-200 mt-1">{pendingBookings}</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            <p className="text-xs text-purple-300/60 tracking-wider">Fetching queue data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-300 text-xs my-4">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-16 bg-[#1e1738]/20 border border-purple-500/10 rounded-2xl">
            <User className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-purple-200">No bookings found</p>
            <p className="text-xs text-purple-300/50 mt-1">The queue is currently empty.</p>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-3.5">
            {bookings.map((booking) => {
              const status = booking.status || 'pending';
              const isPending = status === 'pending';

              return (
                <div 
                  key={booking._id || booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 bg-[#1e1738]/50 hover:bg-[#1e1738]/80 border border-purple-500/15 hover:border-amber-400/40 rounded-2xl transition-all shadow-sm cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-900/60 to-indigo-950 flex items-center justify-center border border-purple-500/30 shadow-inner flex-shrink-0 group-hover:border-amber-400/50 transition-all">
                      <User className="w-5 h-5 text-amber-200" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm tracking-wide group-hover:text-amber-200 transition-all">
                        {booking.name || booking.user?.name || 'Anonymous Seeker'}
                      </h3>
                      <p className="text-xs text-purple-300/70 mt-0.5">
                        {booking.email || booking.user?.email || 'No email provided'}
                      </p>
                      <p className="text-[11px] text-purple-400/50 mt-1 font-mono">
                        Order ID: {booking._id || booking.id || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-purple-500/10">
                    <div className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                      isPending 
                        ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {isPending ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* DETAIL MODAL POPUP */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#141026] border border-purple-500/30 rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedBooking(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-amber-100">Booking Details</h3>
                <p className="text-xs text-purple-300/60">Complete seeker information & transaction record</p>
              </div>
            </div>

            {/* Details Box */}
            <div className="space-y-4 bg-[#1e1738]/50 border border-purple-500/15 rounded-2xl p-4 sm:p-5 text-xs">
              
              <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
                <span className="text-purple-300/60 font-medium">Seeker Name</span>
                <span className="text-white font-semibold text-sm">{selectedBooking.name || selectedBooking.user?.name || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
                <span className="text-purple-300/60 font-medium flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-300" /> Email</span>
                <span className="text-purple-200">{selectedBooking.email || selectedBooking.user?.email || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
                <span className="text-purple-300/60 font-medium flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-300" /> Phone</span>
                <span className="text-purple-200">{selectedBooking.phone || selectedBooking.user?.phone || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
                <span className="text-purple-300/60 font-medium flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-amber-300" /> Order / Transaction ID</span>
                <span className="text-amber-200 font-mono text-[11px] bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">{selectedBooking._id || selectedBooking.id || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
                <span className="text-purple-300/60 font-medium flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-amber-300" /> Amount / Status</span>
                <span className="text-white font-semibold uppercase">{selectedBooking.amount ? `₹${selectedBooking.amount}` : ''} ({selectedBooking.status || 'pending'})</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-purple-300/60 font-medium">Booking Date</span>
                <span className="text-purple-200 font-mono">{new Date(selectedBooking.createdAt || selectedBooking.date).toLocaleString()}</span>
              </div>

            </div>

            {/* Modal Footer Action */}
            <div className="mt-6">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 text-zinc-950 font-bold py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(251,191,36,0.3)] text-xs tracking-wider uppercase cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}