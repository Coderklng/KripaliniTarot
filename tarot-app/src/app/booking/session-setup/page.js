"use client";

export const dynamic = 'force-dynamic';

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Video, Mic, MessageSquare, Calendar, Clock, Sparkles, Loader2, Mail } from "lucide-react";
import Cookies from "js-cookie";

function SessionSetupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get("orderId") || searchParams.get("order_id") || searchParams.get("id");

  const [selectedMode, setSelectedMode] = useState("video");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [customerEmail, setCustomerEmail] = useState(""); // Manual Email State
  const [loading, setLoading] = useState(false);

  const handleSubmitSession = async (e) => {
    e.preventDefault();
    if (!orderId) {
      alert("Order ID missing! Please check the URL parameters.");
      return;
    }

    setLoading(true);
    const token = Cookies.get("admin") || Cookies.get("token") || localStorage.getItem("token");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "";
      const endpoint = `${backendUrl}/api/orders/update-session-mode`;
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          orderId: orderId,
          order_id: orderId,
          mode: selectedMode,
          date: bookingDate || new Date().toLocaleDateString(),
          time: bookingTime || "Immediate / Active Now",
          customerEmail: customerEmail,
        }),
      });

      const rawText = await res.text();
      
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (jsonErr) {
        console.error("Non-JSON Server Response Received:", rawText);
        throw new Error(`Server returned status ${res.status} (Not JSON).`);
      }

      if (res.ok && (data.success !== false)) {
        alert("Session details saved & email sent successfully!");
        
        if (selectedMode === "video") {
          router.push(`/video?orderId=${orderId}&mode=video`);
        } else if (selectedMode === "audio") {
          router.push(`/audio?orderId=${orderId}&mode=audio`);
        } else {
          router.push(`/chats/user?orderId=${orderId}&mode=chat`);
        }
      } else {
        alert(data.message || "Failed to setup session");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert(err.message || "Network error while submitting session details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07040d] text-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-purple-950/40 border border-purple-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/40 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-serif text-amber-200">Setup Your Session</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Payment Successful! Choose your mode and recipient email.
          </p>
        </div>

        <form onSubmit={handleSubmitSession} className="space-y-5">
          {/* Mode Selection Container */}
          <div>
            <label className="block text-xs text-amber-300 font-medium mb-2">
              Select Session Mode:
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMode("video")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  selectedMode === "video"
                    ? "bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                    : "bg-purple-950/40 border-purple-500/20 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Video className="w-5 h-5" />
                <span className="text-xs font-semibold">Video Call</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode("audio")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  selectedMode === "audio"
                    ? "bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                    : "bg-purple-950/40 border-purple-500/20 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Mic className="w-5 h-5" />
                <span className="text-xs font-semibold">Audio Call</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode("chat")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  selectedMode === "chat"
                    ? "bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                    : "bg-purple-950/40 border-purple-500/20 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs font-semibold">Live Chat</span>
              </button>
            </div>
          </div>

          {/* Manual Email Input Box */}
          <div>
            <label className="block text-xs text-amber-300 font-medium mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Recipient Email (Jahan Link Bhejna Hai)</span>
            </label>
            <input
              type="email"
              placeholder="e.g. seemasharma@gmail.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-purple-950/60 border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-zinc-600"
            />
          </div>

          {/* Date & Time Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Date</span>
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3 py-2 bg-purple-950/60 border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-zinc-300 text-xs mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Time</span>
              </label>
              <input
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full px-3 py-2 bg-purple-950/60 border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs tracking-wider uppercase transition-all hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Confirm &amp; Send Link to Email</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SessionSetupPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#07040d] text-purple-400">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        <span className="ml-2 text-xs">Loading Session Setup...</span>
      </div>
    }>
      <SessionSetupContent />
    </Suspense>
  );
}