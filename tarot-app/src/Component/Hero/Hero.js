"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden bg-[#07040d] py-20 px-4 sm:px-6 lg:px-8">
      
      {/* Background Video Layer - Fixed Visibility & Explicit Attributes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50 filter brightness-100 contrast-125"
        >
          <source src="videos/4112431-uhd_3840_2160_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Lighter Gradient Overlay so video remains clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07040d]/60 via-[#07040d]/40 to-[#07040d]/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Top Mystic Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/60 border border-amber-400/30 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-amber-200 tracking-wide">
            Discover Your True Destiny Through Tarot & Intuition
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 tracking-tight leading-tight max-w-4xl"
        >
          Unveil the Secrets of Your Future with <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">Kripalini</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-sm sm:text-base lg:text-lg text-zinc-300 max-w-2xl font-light leading-relaxed"
        >
          Step into the realm of clarity and wisdom. Get personalized tarot readings, expert spiritual guidance, and unlock the answers you’ve been seeking.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link href="/pricing" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:shadow-[0_0_35px_rgba(251,191,36,0.6)] cursor-pointer transform hover:-translate-y-0.5">
              <span>Book Your Reading Now</span>
              <Sparkles className="w-4 h-4 fill-zinc-950" />
            </button>
          </Link>

          <Link href="/reading" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-amber-200 font-medium text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer shadow-lg">
              <span>Explore Readings</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </Link>
        </motion.div>

        {/* Trust Badges / Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-10 border-t border-purple-500/20 grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 text-center w-full max-w-3xl"
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-300 font-bold text-xl sm:text-2xl font-serif">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>4.9 / 5.0</span>
            </div>
            <span className="text-xs text-zinc-400 mt-1">Trusted Client Ratings</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-amber-300 font-bold text-xl sm:text-2xl font-serif">
              1,000+
            </div>
            <span className="text-xs text-zinc-400 mt-1">Successful Readings</span>
          </div>

          <div className="col-span-2 md:col-span-1 flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-300 font-bold text-xl sm:text-2xl font-serif">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>100% Private</span>
            </div>
            <span className="text-xs text-zinc-400 mt-1">Confidential Guidance</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;