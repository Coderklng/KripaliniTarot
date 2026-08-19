"use client";

import React from "react";
import Navbar from "@/Component/Navigation/Navbar";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Flower2,
  ShieldCheck,
  Compass,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";

// Core Features (Genuine & Clean)
const coreFeatures = [
  {
    icon: <Flower2 className="w-6 h-6 text-amber-300" />,
    title: "Intuitive Guidance",
    description: "Readings guided by deep intuition and spiritual connection.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-amber-300" />,
    title: "Confidential & Safe",
    description: "Your privacy is our priority. Every session is 100% confidential.",
  },
  {
    icon: <Compass className="w-6 h-6 text-amber-300" />,
    title: "Clear Insights",
    description: "Honest and accurate insights to help you navigate life's path.",
  },
];

const SectionTitle = ({ subtitle, title }) => (
  <div className="text-center mb-12">
    <div className="flex items-center justify-center gap-2 mb-2">
      <span className="text-amber-400 text-xs">✦</span>
      <span className="text-amber-400 text-xs tracking-widest uppercase font-medium">{subtitle}</span>
      <span className="text-amber-400 text-xs">✦</span>
    </div>
    <h2 className="text-3xl sm:text-4xl font-serif text-amber-100">{title}</h2>
    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-3" />
  </div>
);

export default function AboutPage() {
  return (
    <div className="w-full bg-[#07040d] text-white font-sans overflow-hidden">
      <div className="sticky top-0 w-full z-10">
        <Navbar />
      </div>
      
      {/* HERO SECTION */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-400 text-xs">✦</span>
              <span className="text-amber-400 text-xs tracking-widest uppercase font-semibold">Our Story</span>
              <span className="text-amber-400 text-xs">✦</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-amber-100 leading-tight mb-4">
              About <br />
              <span className="text-amber-300 font-normal">Kripalini</span>
            </h1>

            <p className="text-lg sm:text-xl font-serif italic text-purple-300/90 mb-6">
              Guiding Souls with Intuition & Wisdom
            </p>

            <div className="w-12 h-[1px] bg-amber-400 mb-6" />

            <p className="text-sm text-zinc-300 leading-relaxed max-w-lg font-light">
              Kripalini Tarot Reader is a space dedicated to providing clarity and spiritual insight. Our goal is to help you navigate life's journey with confidence, utilizing the timeless wisdom of Tarot to find the answers you seek.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-full p-2 border border-amber-400/30 bg-purple-950/20 backdrop-blur-sm">
              <div className="w-full h-full rounded-full overflow-hidden relative border border-amber-400/50 shadow-[0_0_50px_rgba(147,51,234,0.3)]">
                <Image
                  src="/images/logos/logo.jpg"
                  alt="Kripalini Tarot Reader"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07040d] via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* WHAT MAKES US SPECIAL */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle subtitle="Our Approach" title="Why Choose Kripalini?" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreFeatures.map((feat, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-purple-950/20 border border-purple-500/20 hover:border-amber-400/50 transition-all text-center flex flex-col items-center hover:-translate-y-1 duration-300"
            >
              <div className="w-14 h-14 rounded-full border border-amber-400/40 bg-purple-900/40 flex items-center justify-center mb-6">
                {feat.icon}
              </div>
              <h3 className="text-lg font-serif text-amber-200 mb-3">{feat.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-amber-400/40 p-8 sm:p-12 bg-gradient-to-r from-purple-950 via-[#120924] to-purple-950 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[0_0_50px_rgba(147,51,234,0.2)]">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-2xl sm:text-4xl font-serif text-amber-100 mb-3">
              Ready to find the clarity you seek?
            </h2>
            <p className="text-sm text-zinc-300 font-light">
              Connect with us to start your journey today.
            </p>
          </div>

          <Link href="/contact" className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-xl flex items-center gap-2 shrink-0">
            <span>Contact Us Now</span>
            <Sparkles className="w-4 h-4 fill-zinc-950" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-500/20 bg-[#040208] pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 text-sm">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-serif text-amber-200 font-bold">Kripalini</h3>
            </div>
            <p className="text-zinc-400 leading-relaxed font-light mb-4">
              Providing professional Tarot readings and intuitive guidance.
            </p>
            <div className="flex items-center gap-3 text-zinc-400">
              <MessageCircle className="w-5 h-5 hover:text-amber-400 cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-serif text-amber-200 text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3 text-zinc-400 font-light">
              <li><Link href="/" className="hover:text-amber-300 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-amber-300 transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-amber-300 transition-colors">Services</Link></li>
              <li><Link href="/contact" className="hover:text-amber-300 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-amber-200 text-lg mb-4">Contact Info</h4>
            <div className="space-y-4 text-zinc-400 font-light">
              <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-amber-400" /> +91 98765 43210</div>
              <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-amber-400" /> kripalini.tarot@gmail.com</div>
              <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-amber-400" /> Jaipur, Rajasthan, India</div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© 2026 Kripalini Tarot Reader. All Rights Reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
             <Link href="/privacy" className="hover:text-amber-300">Privacy Policy[cite: 1]</Link>
             <Link href="/terms" className="hover:text-amber-300">Terms of Service[cite: 1]</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}