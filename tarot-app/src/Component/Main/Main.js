"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Compass, Feather } from "lucide-react";

const Main = () => {
  return (
    <section className="w-full bg-zinc-950 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-zinc-900 via-purple-950/40 to-red-950/30 border border-purple-500/20 p-8 lg:p-12 shadow-2xl backdrop-blur-sm">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Column 1: Image Section */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border-2 border-amber-400/50 shadow-inner">
                <Image
                  src="/images/logos/logo.jpg"
                  alt="Kripalini Tarot"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Column 2: Bio Text & Professional Highlights Section */}
          <div className="lg:col-span-8 flex flex-col justify-center space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 tracking-wider uppercase text-sm font-semibold">
                  About The Reader
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-purple-200 mt-1">
                Kripalini
              </h1>
            </div>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
              Dedicated to helping souls find clarity, emotional healing, and practical direction through intuitive tarot insights and timeless spiritual wisdom.
            </p>

            {/* AdSense Safe Feature Pills (No unverified numbers or fake claims) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-purple-500/10">
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/20 text-amber-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-medium text-amber-200">Intuitive Guidance</h3>
                  <p className="text-xs text-zinc-400">Focused on personal growth & clarity</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-purple-500/10">
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/20 text-amber-400">
                  <Feather className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-medium text-amber-200">Sacred Wisdom</h3>
                  <p className="text-xs text-zinc-400">Mindful & confidential sessions</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Main;