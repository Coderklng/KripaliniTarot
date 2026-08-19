"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import "../../app/global.css";
import { Sparkles, Menu, X, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Readings", href: "/reading" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Pricing", href: "/pricing" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

const Navbar = ({ userTokens, setUserTokens }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!mounted) return null;
  
  return (
    <>
      <nav className={`w-full sticky top-0 z-40 h-20 transition-all duration-300 ${
        scrolled 
          ? "bg-[#07040d]/95 backdrop-blur-xl border-b border-purple-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
          : "bg-[#07040d]/80 backdrop-blur-md border-b border-purple-500/15"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">

            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl border border-amber-400/40 flex items-center justify-center bg-gradient-to-br from-purple-950/80 to-purple-900/30 shadow-[0_0_15px_rgba(251,191,36,0.15)] group-hover:border-amber-400 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 tracking-wide leading-none">
                  Kripalini
                </h1>
                <span className="text-[10px] text-amber-400/70 tracking-[0.2em] uppercase font-semibold">
                  Tarot & Mystic
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-medium text-zinc-300 h-full">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name} className="h-full flex items-center">
                    <Link
                      href={link.href}
                      className={`relative h-full px-3 flex items-center text-[13px] font-medium transition-colors duration-300 ${
                        isActive 
                          ? "text-amber-300 font-semibold" 
                          : "text-zinc-300 hover:text-amber-300"
                      } group`}
                    >
                      <span>{link.name}</span>
                      {/* Amber Border Bottom Animation on Hover & Active */}
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-amber-400 transition-all duration-300 shadow-[0_0_8px_rgba(251,191,36,0.8)] ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`} />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right Side: Tokens, Login, Register & CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Flying Big Gold Coin Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold shadow-[inset_0_0_10px_rgba(251,191,36,0.1)]">
                <motion.span
                  animate={{
                    y: [-4, 4, -4],
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-base inline-block drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                >
                  🪙
                </motion.span>
                <span className="tracking-wider">{userTokens}</span>
              </div>

              {/* Login Button */}
              <Link href="/login">
                <button className="px-3.5 py-2 rounded-xl text-zinc-300 hover:text-amber-300 hover:bg-purple-950/30 text-xs font-medium transition-all duration-300 flex items-center gap-1.5 cursor-pointer">
                  <LogIn className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Login</span>
                </button>
              </Link>

              {/* Register Button */}
              <Link href="/register">
                <button className="px-3.5 py-2 rounded-xl border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/40 text-amber-200 text-xs font-medium transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm">
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Register</span>
                </button>
              </Link>

              {/* Book Reading CTA */}
              <Link href="/pricing">
                <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs transition-all duration-300 flex items-center gap-1.5 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_25px_rgba(251,191,36,0.5)] cursor-pointer transform hover:-translate-y-0.5">
                  <span>Book Reading</span>
                  <Sparkles className="w-3.5 h-3.5 fill-zinc-950" />
                </button>
              </Link>
            </div>

            {/* Mobile Right Section (Coin + Menu Button) */}
            <div className="flex lg:hidden items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
                <motion.span
                  animate={{
                    y: [-3, 3, -3],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-sm inline-block"
                >
                  🪙
                </motion.span>
                <span>{userTokens}</span>
              </div>

              <button
                onClick={() => setIsOpen(true)}
                type="button"
                className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-amber-200 hover:text-amber-400 focus:outline-none cursor-pointer transition-colors"
                aria-label="Open Menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-[101] w-full max-w-xs bg-[#090514] p-6 shadow-2xl border-l border-purple-500/30 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-purple-500/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl border border-amber-400/40 flex items-center justify-center bg-purple-950/60">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <span className="text-lg font-serif font-bold text-amber-200 tracking-wider">
                      Kripalini
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    type="button"
                    className="p-1.5 text-zinc-400 hover:text-white bg-purple-950/40 border border-purple-500/20 rounded-lg cursor-pointer"
                    aria-label="Close Menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Nav Links */}
                <ul className="flex flex-col gap-2 mt-5 text-sm font-medium">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`block px-4 py-2.5 rounded-xl transition-all ${
                            isActive
                              ? "bg-purple-900/40 text-amber-300 border border-purple-500/30 font-semibold"
                              : "text-zinc-300 hover:text-amber-300 hover:bg-purple-950/20"
                          }`}
                        >
                          {link.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Mobile Bottom CTAs */}
              <div className="pt-5 border-t border-purple-500/20 flex flex-col gap-2.5 mt-6">
                <div className="grid grid-cols-2 gap-2.5">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <button className="w-full bg-purple-950/50 hover:bg-purple-900/50 border border-purple-500/30 text-zinc-200 font-medium py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer">
                      <LogIn className="w-3.5 h-3.5 text-amber-400" />
                      <span>Login</span>
                    </button>
                  </Link>

                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <button className="w-full bg-purple-900/60 hover:bg-purple-800/60 border border-purple-400/40 text-amber-200 font-medium py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer">
                      <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Register</span>
                    </button>
                  </Link>
                </div>

                <Link href="/pricing" onClick={() => setIsOpen(false)}>
                  <button className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                    <span>Book Your Reading</span>
                    <Sparkles className="w-4 h-4 fill-zinc-950" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;