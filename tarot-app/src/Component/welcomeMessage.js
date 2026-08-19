'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles, Send, Bell } from 'lucide-react';

export default function WelcomeMessageWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // User ke website par aate hi 2 second baad auto message popup khulega
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasUnread(false); // Pop-up khulte hi unread dot hat jayega
    }, 2000);

    // Notification bell icon pulse effect
    const pulseInterval = setInterval(() => {
      setIsAnimating((prev) => !prev);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(pulseInterval);
    };
  }, []);

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    if (hasUnread) setHasUnread(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* 1. FLOATING BELL BUTTON WITH UNREAD BADGE */}
      <div className="relative">
        {hasUnread && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center">
              1
            </span>
          </span>
        )}

        <button
          type="button"
          onClick={handleOpenToggle}
          className={`w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 border border-purple-400/30 ${
            isAnimating && hasUnread ? 'animate-bounce' : ''
          }`}
          aria-label="Open Messages"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Bell className="w-6 h-6 text-amber-300" />
          )}
        </button>
      </div>

      {/* 2. AUTO WELCOME MESSAGE POPUP BOX */}
      {isOpen && (
        <div className="absolute bottom-18 right-0 w-80 sm:w-96 bg-[#131024] border border-[#2D284D] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1D1936] to-[#151226] p-4 border-b border-[#231F3B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold font-serif text-lg">
                  K
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#131024] rounded-full"></span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  Kripalini Tarot <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-medium">Online Now</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#231F3B] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Message Content */}
          <div className="p-4 space-y-3 bg-[#0D0B18]">
            <span className="text-[10px] text-gray-500 text-center block">Today</span>

            <div className="flex items-start gap-2.5">
              <div className="bg-[#1C1833] text-gray-200 text-xs p-3.5 rounded-2xl rounded-tl-none border border-[#29244A] max-w-[85%] leading-relaxed shadow-md">
                <p className="font-semibold text-amber-300 mb-1">Namaste! 🙏</p>
                <p>
                  Welcome to my Tarot Reading space! Agar aapki life, career ya relationship me koi confusion h, toh aap guidance ke liye direct msg kar sakte hain.
                </p>
                <span className="text-[9px] text-gray-400 block text-right mt-1">Just now</span>
              </div>
            </div>
          </div>

          {/* Quick Reply / Input Area */}
          <div className="p-3 bg-[#131024] border-t border-[#231F3B] flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-[#1A1633] border border-[#282348] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500"
            />
            <button 
              type="button" 
              className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}