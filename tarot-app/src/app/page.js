'use client';

import { useState, useEffect, useRef } from "react";
import Hero from "@/Component/Hero/Hero";
import Navbar from "@/Component/Navigation/Navbar";
import LinearProgressIndicator from "@/Component/UI/LinearProgressIndicator";
import Link from "next/link";
import Main from "@/Component/Main/Main";
import "./global.css";
import TarotCard from "@/Component/CardDisplay/TarotCard";
import { requestForToken } from "@/lib/firebaseClient";
import { motion } from "framer-motion";
import { Sparkles, Trophy, AlertCircle, Loader2, Play, Gift, X, Volume2, VolumeX } from 'lucide-react';

const WHEEL_SECTORS = [
  { id: 1, label: 'Free 1-Card Reading', color: '#7c3aed' },
  { id: 2, label: '10% Off Coupon', color: '#d97706' },
  { id: 3, label: 'Cosmic Energy (Try Again)', color: '#4b5563' },
  { id: 4, label: 'Free Full Reading', color: '#9333ea' },
  { id: 5, label: '5% Off Coupon', color: '#b45309' },
  { id: 6, label: 'Mystic Blessing', color: '#581c87' },
];

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  // Spin Wheel & Token states
  const [userTokens, setUserTokens] = useState(1);
  const [isSpinOpen, setIsSpinOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [spinError, setSpinError] = useState(null);
  const [rotation, setRotation] = useState(0);

  // Ambient Sound states
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  // Initial Shimmer Loader Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const toggleSound = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.log("Audio play blocked:", err);
        });
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const handleSendNotification = async () => {
    setLoading(true);

    try {
      const token = await requestForToken();

      if (!token) {
        alert("Notification permission deny ho gayi ya token nahi mila!");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          title: "Tarot Insights ✨",
          body: "Your daily tarot reading is ready to explore!",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        console.error("FCM Error:", data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const spinTheWheel = async () => {
    if (userTokens <= 0) {
      setSpinError("You don't have enough spin tokens! Book a reading to earn more.");
      return;
    }

    try {
      setIsSpinning(true);
      setSpinError(null);
      setPrize(null);

      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/rewards/spin`, {
        method: 'POST',
        headers:{ 'Authorization': `Bearer ${token} `}
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to process spin.');
      }

      if (result.remainingTokens !== undefined) {
        setUserTokens(result.remainingTokens);
      } else {
        setUserTokens(prev => Math.max(0, prev - 1));
      }

      const winningIndex = Math.floor(Math.random() * WHEEL_SECTORS.length);
      const degreesPerSector = 360 / WHEEL_SECTORS.length;
      const extraRounds = 5 * 360;
      const targetDegree = extraRounds + (WHEEL_SECTORS.length - winningIndex) * degreesPerSector - (degreesPerSector / 2);

      setRotation(targetDegree);

      setTimeout(() => {
        setPrize(WHEEL_SECTORS[winningIndex]);
        setIsSpinning(false);
      }, 4000);

    } catch (err) {
      console.error("Spin error:", err);
      setSpinError(err.message || 'Something went wrong during the spin.');
      setIsSpinning(false);
    }
  };

  // Shimmer Skeleton Loader Screen
  if (pageLoading) {
    return (
      <main className="w-full min-h-screen bg-zinc-950 flex items-center justify-center px-4 overflow-hidden">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center space-y-8 animate-pulse">
          <div className="w-64 h-8 rounded-full bg-purple-950/40 border border-purple-500/20" />
          <div className="w-full max-w-3xl space-y-4 flex flex-col items-center">
            <div className="w-full h-14 sm:h-20 rounded-2xl bg-gradient-to-r from-purple-950/20 via-amber-900/20 to-purple-950/20" />
            <div className="w-3/4 h-14 sm:h-20 rounded-2xl bg-gradient-to-r from-purple-950/20 via-amber-900/20 to-purple-950/20" />
          </div>
          <div className="w-full max-w-xl h-12 rounded-xl bg-purple-950/30" />
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
            <div className="w-full sm:w-48 h-14 rounded-2xl bg-amber-500/20" />
            <div className="w-full sm:w-48 h-14 rounded-2xl bg-purple-900/30" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen text-white relative selection:bg-amber-500 selection:text-zinc-950">
      
      {/* Hidden Audio Element for Ambient Mystical Sound */}

      <Navbar userTokens={userTokens} setUserTokens={setUserTokens} />
      <Hero />
      <Main />
      <TarotCard />
      <LinearProgressIndicator />

      {/* 1. SPIN WHEEL BUTTON (Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSpinOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#141026]/90 backdrop-blur-xl border border-amber-400/30 text-amber-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-amber-400 transition-all cursor-pointer"
          title="Lucky Spin Wheel"
        >
          <Gift className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-[#141026]">
            {userTokens}
          </span>
        </motion.button>
      </div>

      {/* 2. PUSH NOTIFICATION BELL (Bottom-Right) */}
      <motion.button
        onClick={handleSendNotification}
        disabled={loading}
        title="Test Push Notification"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 bg-red-600/90 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl shadow-2xl backdrop-blur-md transition-all cursor-pointer border-2 border-red-900"
      >
        {loading ? (
          <span className="animate-spin text-lg">⏳</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
        )}
      </motion.button>

      {/* SPIN WHEEL MODAL */}
      {isSpinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 bg-[#141026] border border-purple-500/30 rounded-[32px] text-white shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-center relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsSpinOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-1 mt-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h2 className="text-xl font-serif text-amber-100">Mystic Spin Wheel</h2>
            </div>
            <p className="text-xs text-purple-300/70 mb-4">Use 1 Spin Token to unlock cosmic rewards & discounts!</p>

            {/* Token Balance Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-xs font-medium text-purple-200 mb-5">
              <span>Available Tokens:</span>
              <span className="text-amber-300 font-bold font-mono">{userTokens}</span>
            </div>

            {/* Wheel Container */}
            <div className="relative w-56 h-56 mx-auto mb-5 flex items-center justify-center">
              
              {/* Wheel Pointer */}
              <div className="absolute -top-3 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-amber-400 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"></div>

              {/* Rotating Wheel Graphic */}
              <div 
                className="w-full h-full rounded-full border-4 border-amber-400/40 relative overflow-hidden shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all ease-out"
                style={{ 
                  transitionDuration: isSpinning ? '4s' : '0s',
                  transform: `rotate(${rotation}deg)` 
                }}
              >
                {WHEEL_SECTORS.map((sector, index) => {
                  const angle = (360 / WHEEL_SECTORS.length) * index;
                  return (
                    <div 
                      key={sector.id}
                      className="absolute w-1/2 h-full top-0 right-0 origin-left flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-white px-4"
                      style={{
                        backgroundColor: sector.color,
                        transform: `rotate(${angle}deg)`,
                        clipPath: 'polygon(0 50%, 100% 0, 100% 100%)'
                      }}
                    >
                      <span className="rotate-90 translate-x-3 text-center">{sector.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Center Knob */}
              <div className="absolute z-10 w-10 h-10 rounded-full bg-[#141026] border-2 border-amber-400 flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
            </div>

            {/* Error Message */}
            {spinError && (
              <div className="flex items-center justify-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{spinError}</span>
              </div>
            )}

            {/* Winning Result Box */}
            {prize && !isSpinning && (
              <div className="p-3 mb-4 bg-amber-400/10 border border-amber-400/30 rounded-2xl animate-bounce">
                <Trophy className="w-5 h-5 text-amber-300 mx-auto mb-1" />
                <p className="text-xs text-amber-200 font-medium">Congratulations! You won:</p>
                <h3 className="text-xs font-bold text-white mt-0.5">{prize.label}</h3>
              </div>
            )}

            {/* Spin Button */}
            <button
              onClick={spinTheWheel}
              disabled={isSpinning}
              className="w-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 text-zinc-950 font-bold py-3 rounded-2xl transition-all shadow-[0_4px_25px,rgba(251,191,36,0.4)] text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSpinning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Spinning...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Spin Now (1 Token)</span>
                </>
              )}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Home;