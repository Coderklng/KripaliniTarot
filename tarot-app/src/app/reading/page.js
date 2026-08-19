"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Settings,
  RotateCcw,
  Grid,
  Layers,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { FULL_TAROT_DECK } from "@/data/tarotDeck";

export default function TarotDashboard() {
  const [cards, setCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [viewMode, setViewMode] = useState("spread"); // 'spread' | 'all'

  // Image loading error handling fallback URL
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?q=80&w=600&auto=format&fit=crop";

  useEffect(() => {
    if (FULL_TAROT_DECK && FULL_TAROT_DECK.length > 0) {
      setCards([FULL_TAROT_DECK[18], FULL_TAROT_DECK[6], FULL_TAROT_DECK[19]]);
    }
  }, []);

  const handleShuffle = () => {
    if (!FULL_TAROT_DECK || FULL_TAROT_DECK.length === 0) return;

    setIsShuffling(true);
    setTimeout(() => {
      const shuffledDeck = [...FULL_TAROT_DECK].sort(() => 0.5 - Math.random());
      
      if (viewMode === "spread") {
        setCards(shuffledDeck.slice(0, 3));
      } else {
        setCards(shuffledDeck);
      }
      setIsShuffling(false);
    }, 600);
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
    if (mode === "all") {
      setCards(FULL_TAROT_DECK);
    } else {
      setCards([FULL_TAROT_DECK[18], FULL_TAROT_DECK[6], FULL_TAROT_DECK[19]]);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0813] text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/60 bg-[#0f0a1c]/80 backdrop-blur-md p-4 flex flex-col justify-between hidden lg:flex shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400 font-serif text-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              🎴
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-wide text-amber-200">
                Kripalini
              </h1>
              <p className="text-[10px] tracking-widest uppercase text-slate-400">
                Tarot Reader
              </p>
            </div>
          </div>

          <nav className="space-y-1 text-sm font-medium">
            {[
              { label: "Readings", icon: Sparkles, active: true, href: "/reading" },
              { label: "Settings", icon: Settings, href: "/setting" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    item.active
                      ? "bg-gradient-to-r from-purple-900/60 to-indigo-900/40 text-purple-200 border border-purple-500/30 shadow-lg"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.active ? "text-purple-400" : ""}`} />
                    <span>{item.label}</span>
                  </div>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-800/60">
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-purple-950/40 to-slate-900/80 p-4 shadow-xl">
            <h3 className="text-sm font-semibold text-amber-200">Book Your Next Reading</h3>
            <p className="text-xs text-slate-400 mt-1">Discover clarity and guidance for your journey.</p>
            <button className="mt-3 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:brightness-110 transition-all">
              Book Now <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-amber-500/40">
                  <span className="text-xs font-bold text-amber-200">KT</span>
                </div>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 absolute -bottom-0.5 -right-0.5 bg-slate-950 rounded-full" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Kripalini</p>
                <p className="text-[10px] text-slate-400">Tarot Reader</p>
              </div>
            </div>
            <a href="#setting" className="text-[11px] text-purple-400 hover:text-purple-300 font-medium px-2.5 py-1 rounded-lg border border-purple-500/20 bg-purple-950/30 transition-colors">
              View
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-slate-100 flex items-center gap-2">
              Your Tarot Reading <Sparkles className="w-5 h-5 text-amber-400" />
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              The cards hold the messages you need to see.
            </p>
          </div>

          {/* View Switch Controls */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleViewChange("spread")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "spread"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> 3-Card Spread
            </button>
            <button
              onClick={() => handleViewChange("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "all"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> All Deck Cards
            </button>
          </div>
        </div>

        {/* Dynamic Display Grid */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#150f2a] to-[#0d091a] border border-slate-800/80 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-amber-400/80 font-semibold">
              ✧ {viewMode === "spread" ? "3 Card Reading Spread" : `Full Deck (${cards.length} Cards)`} ✧
            </span>
          </div>

          <div
            className={`grid gap-6 ${
              viewMode === "spread"
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            }`}
          >
            {cards.map((card, idx) => {
              const positions = ["PAST", "PRESENT", "FUTURE"];
              return (
                <motion.div
                  key={card.id ? `${card.id}-${idx}` : idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                  className="flex flex-col items-center group"
                >
                  {viewMode === "spread" && (
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3 px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                      {positions[idx]}
                    </span>
                  )}

                  <div className="w-full aspect-[2/3] rounded-2xl border-2 border-amber-500/50 bg-slate-900 overflow-hidden relative shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400 group-hover:shadow-amber-500/20 flex flex-col justify-between p-2.5">
                    <img
                      src={card.image}
                      alt={card.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/60" />

                    <span className="relative z-10 text-[10px] font-serif font-bold text-amber-300 tracking-wider">
                      {card.number}
                    </span>

                    <div className="relative z-10 text-center border-t border-amber-500/40 pt-1 backdrop-blur-xs bg-slate-950/40 rounded-b-lg">
                      <span className="text-[10px] font-serif tracking-wider font-bold text-amber-200 uppercase block truncate">
                        {card.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleShuffle}
              disabled={isShuffling}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isShuffling ? "animate-spin" : ""}`} />
              {isShuffling ? "Shuffling Cards..." : "Shuffle Deck"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}