"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Globe,
  Share2,
  MessageCircle,
  Compass,
  Flame,
  Moon,
  Sun,
  BookOpen,
  Lock,
  Eye,
  Feather
} from "lucide-react";
import Navbar from "@/Component/Navigation/Navbar";

// Replaced unverified numbers with professional spiritual pillars for AdSense compliance
const corePillars = [
  {
    icon: <Feather className="w-5 h-5 text-amber-300" />,
    value: "Sacred Wisdom",
    label: "Ancient Tarot Insight",
  },
  {
    icon: <Lock className="w-5 h-5 text-amber-300" />,
    value: "100% Privacy",
    label: "Confidential Sessions",
  },
  {
    icon: <Eye className="w-5 h-5 text-amber-300" />,
    value: "Deep Clarity",
    label: "Intuitive Guidance",
  },
  {
    icon: <Sparkles className="w-5 h-5 text-amber-300" />,
    value: "Divine Alignment",
    label: "Personal Growth Path",
  },
];

const focusAreas = [
  {
    id: "love",
    title: "Love & Relationships",
    icon: <Heart className="w-4 h-4 text-amber-400" />,
    insight: "The cards reveal a period of emotional healing and deeper soul connections. Open your heart to honest communication."
  },
  {
    id: "career",
    title: "Career & Ambition",
    icon: <Flame className="w-4 h-4 text-amber-400" />,
    insight: "Your hard work is aligning with new opportunities. Trust your leadership instincts and take that bold next step."
  },
  {
    id: "peace",
    title: "Inner Peace & Healing",
    icon: <Moon className="w-4 h-4 text-amber-400" />,
    insight: "Release what you cannot control. A quiet mind will soon bring clarity and renewed spiritual alignment."
  },
  {
    id: "wealth",
    title: "Wealth & Abundance",
    icon: <Sun className="w-4 h-4 text-amber-400" />,
    insight: "Abundance flows when your energy is focused on gratitude. Smart financial choices made today will yield lasting security."
  }
];

export default function TestimonialsPage() {
  const [selectedFocus, setSelectedFocus] = useState(focusAreas[0]);
  const [cosmicNote, setCosmicNote] = useState("“The universe is not outside of you. Look inside; everything that you want, you already are.”");

  const generateCosmicMessage = () => {
    const messages = [
      "“Trust the timing of your life. What is meant for you will never miss you.”",
      "“Your intuition is your most sacred compass. Listen closely to the whisper within.”",
      "“Every ending is simply the universe clearing space for a magnificent new beginning.”",
      "“Step into your power. The energy you project today shapes your entire tomorrow.”"
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setCosmicNote(randomMsg);
  };

  return (
    <div className="w-full bg-[#07040d] text-white font-sans overflow-hidden min-h-screen">

      <Navbar />

      {/* HERO SECTION */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-400 text-xs">✦</span>
            <span className="text-amber-400 text-xs tracking-widest uppercase font-semibold">Divine Insights & Guidance</span>
            <span className="text-amber-400 text-xs">✦</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-amber-100 leading-tight mb-4">
            Path of <span className="text-amber-300 font-normal">Clarity & Awakening</span>
          </h1>

          <div className="w-12 h-[1px] bg-amber-400 mb-4" />

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light mb-12 max-w-xl">
            Explore the energetic frequencies of your life path. Select an area of focus below to receive intuitive guidance crafted for your soul's journey.
          </p>

        </div>

        {/* COMPLIANT PILLARS BAR (AdSense Safe) */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 rounded-2xl bg-purple-950/30 border border-purple-500/20 backdrop-blur-md">
          {corePillars.map((pillar, idx) => (
            <div key={idx} className="flex items-center gap-3.5 px-2">
              <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center shrink-0">
                {pillar.icon}
              </div>
              <div>
                <h3 className="text-sm font-serif font-bold text-amber-200 leading-tight">{pillar.value}</h3>
                <span className="text-[11px] text-zinc-400 font-light">{pillar.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE ENERGY & FOCUS SELECTOR SECTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-amber-400 text-xs">✦</span>
            <h2 className="text-xl sm:text-2xl font-serif text-amber-200">What Area Seeks Guidance Today?</h2>
            <span className="text-amber-400 text-xs">✦</span>
          </div>
          <p className="text-xs text-zinc-400 font-light">Select a life path to reveal specialized spiritual insights.</p>
        </div>

        {/* SELECTOR TABS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {focusAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => setSelectedFocus(area)}
              className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                selectedFocus.id === area.id
                  ? "bg-gradient-to-br from-purple-900/60 to-purple-950/80 border-amber-400 shadow-[0_0_20px_rgba(217,119,6,0.2)] text-amber-200"
                  : "bg-purple-950/20 border-purple-500/20 text-zinc-300 hover:border-amber-400/40"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center shrink-0">
                {area.icon}
              </div>
              <span className="text-xs font-serif font-medium">{area.title}</span>
            </button>
          ))}
        </div>

        {/* DYNAMIC INSIGHT CARD */}
        <motion.div
          key={selectedFocus.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8 rounded-2xl bg-gradient-to-b from-purple-950/60 to-purple-900/40 border-2 border-amber-400/60 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Compass className="w-32 h-32 text-amber-400" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-400 text-sm">✦</span>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-amber-300">{selectedFocus.title} Reading</h3>
            </div>
            <p className="text-sm sm:text-base text-zinc-200 font-serif leading-relaxed mb-6">
              "{selectedFocus.insight}"
            </p>
            <div className="flex items-center gap-3 text-xs text-amber-300/80">
              <Sparkles className="w-4 h-4" />
              <span>Channelized through Tarot Intuition & Divine Alignment</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* COSMIC MESSAGE GENERATOR SECTION */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-amber-400/30 p-8 bg-purple-950/30 backdrop-blur-md text-center relative overflow-hidden">
          <h3 className="text-lg sm:text-xl font-serif text-amber-200 mb-2">Need an Instant Spiritual Spark?</h3>
          <p className="text-xs text-zinc-400 mb-6">Tap below to draw a spontaneous cosmic message for your day.</p>
          
          <div className="min-h-[80px] flex items-center justify-center mb-6 px-4">
            <p className="text-xs sm:text-sm font-serif text-amber-100 italic">{cosmicNote}</p>
          </div>

          <button
            onClick={generateCosmicMessage}
            className="px-6 py-2.5 rounded-full bg-purple-900/60 hover:bg-amber-400 hover:text-zinc-950 text-amber-300 border border-amber-400/50 text-xs font-bold tracking-wide transition-all shadow-lg inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Draw Cosmic Message</span>
          </button>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden border border-amber-400/30 p-6 sm:p-8 bg-gradient-to-r from-purple-950 via-[#120924] to-purple-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-purple-900/50 border border-amber-400/40 flex items-center justify-center shrink-0 hidden sm:flex">
              <Calendar className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif text-amber-100 mb-1">
                Begin Your Personal Transformation
              </h3>
              <p className="text-xs text-zinc-300 font-light">
                Take the first step towards deep clarity, peace and a brighter future.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-xl flex items-center gap-2">
              <span>Book Your Reading Now</span>
              <Sparkles className="w-3.5 h-3.5 fill-zinc-950" />
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-amber-300/90">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Confidential & Safe</span>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-500/20 bg-[#040208] pt-14 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 text-xs">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-serif text-amber-200 font-bold">Kripalini</h3>
            </div>
            <p className="text-zinc-400 leading-relaxed font-light mb-4">
              Guiding souls with intuition, compassion and the timeless wisdom of Tarot.
            </p>
            <div className="flex items-center gap-3 text-zinc-400">
              <Globe className="w-4 h-4 hover:text-amber-400 cursor-pointer" />
              <MessageCircle className="w-4 h-4 hover:text-amber-400 cursor-pointer" />
              <Share2 className="w-4 h-4 hover:text-amber-400 cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-serif text-amber-200 text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-zinc-400 font-light">
              <li><Link href="/" className="hover:text-amber-300">Home</Link></li>
              <li><Link href="/about" className="hover:text-amber-300">About Us</Link></li>
              <li><Link href="/services" className="hover:text-amber-300">Services</Link></li>
              <li><Link href="#readings" className="hover:text-amber-300">Readings</Link></li>
              <li><Link href="/testimonials" className="hover:text-amber-300">Testimonials</Link></li>
              <li><Link href="#blog" className="hover:text-amber-300">Blog</Link></li>
              <li><Link href="#contact" className="hover:text-amber-300">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-amber-200 text-sm mb-4">Services</h4>
            <ul className="space-y-2 text-zinc-400 font-light">
              <li>Love & Relationships</li>
              <li>Career Guidance</li>
              <li>Finance & Wealth</li>
              <li>Health & Wellbeing</li>
              <li>Spiritual Guidance</li>
              <li>Life Purpose</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-amber-200 text-sm mb-4">Contact Us</h4>
            <div className="space-y-3 text-zinc-400 font-light">
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-amber-400" /> +91 98765 43210</div>
              <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-amber-400" /> kripalini.tarot@gmail.com</div>
              <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-amber-400" /> Jaipur, Rajasthan, India</div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500">
          <p>© 2026 Kripalini Tarot Reader. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0">Designed with <Heart className="w-3 h-3 text-red-500 inline mx-0.5 fill-red-500" /> for divine guidance</p>
        </div>
      </footer>

    </div>
  );
}