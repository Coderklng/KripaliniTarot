"use client";

import { useState } from "react";
import {
  FiLayout,
  FiCalendar,
  FiCompass,
  FiMessageSquare,
  FiUsers,
  FiCreditCard,
  FiBookOpen,
  FiBarChart2,
  FiSettings,
  FiHelpCircle,
  FiSearch,
  FiBell,
  FiMail,
  FiEdit3,
  FiSend,
  FiLock,
  FiZap,
  FiShield,
  FiHeart,
  FiGlobe,
  FiUserCheck,
  FiSun,
  FiStar,
  FiCheckCircle,
  FiAlertCircle,
  FiType
} from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaYoutube, FaWhatsapp, FaPinterestP } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

export default function EmailPage() {
  const [emailTo, setEmailTo] = useState("client@example.com");
  const [subject, setSubject] = useState("Welcome to Kripalini Tarot Services ✨");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("Messages");
  const [footerEmail, setFooterEmail] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  // Quick Templates List for Emails
  const templates = [
    { label: "Good Morning", icon: <FiSun />, text: "Wishing you a calm and blessed day filled with light and clarity. ✨" },
    { label: "Stay Positive", icon: <FiHeart />, text: "Trust the universe. Everything is unfolding exactly as it should. 🔮" },
    { label: "Thinking of You", icon: <HiSparkles />, text: "Sending positive energy and warmth your way today. 🌟" },
    { label: "All the Best", icon: <FiStar />, text: "May your upcoming journey bring wisdom and total success! ✦" },
  ];

  const handleTemplateClick = (templateText) => {
    setMessage(templateText);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailTo.trim() || !subject.trim() || !message.trim()) {
      setStatus({ type: "error", text: "Please fill in Recipient, Subject, and Message." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", text: "" });

    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailTo,
          subject: subject,
          text: message,
          html: `<div style="font-family: sans-serif; color: #333; padding: 20px;">
                  <h2 style="color: #6b21a8;">Kripalini Tarot Reader 🔮</h2>
                  <p style="font-size: 14px;">${message}</p>
                 </div>`
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ type: "success", text: `Email sent successfully to ${emailTo}! ✨` });
        setMessage("");
      } else {
        setStatus({ type: "error", text: data.message || "Failed to send email." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: "Server unreachable. Make sure backend is running!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070314] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black flex flex-col">
      
      {/* ==================== TOP NAVIGATION BAR ==================== */}
      <header className="bg-[#0c0621]/80 backdrop-blur-md border-b border-purple-900/30 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-serif text-lg">
            ✦
          </div>
          <div>
            <h1 className="font-serif text-base font-bold text-amber-200 tracking-wider uppercase leading-none">
              Kripalini
            </h1>
            <span className="text-[9px] text-purple-300/60 tracking-widest uppercase">
              Tarot Reader
            </span>
          </div>
        </div>

        {/* Right Search & User Profile */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block w-48">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/40 text-xs" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-[#140b2f] border border-purple-900/40 rounded-full py-1.5 pl-8 pr-3 text-xs text-white placeholder-purple-300/30 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <button className="relative p-2 text-purple-300/80 hover:text-white transition-colors">
            <FiBell className="text-base" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full"></span>
          </button>

          {/* User Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-purple-900/40">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5">
              <div className="w-full h-full bg-[#0c0621] rounded-full flex items-center justify-center text-amber-300 font-bold text-xs">
                KS
              </div>
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <p className="text-xs font-semibold text-white">Kartik Sharma</p>
              <p className="text-[10px] text-purple-300/50">Seeker</p>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== BODY WRAPPER ==================== */}
      <div className="flex flex-1">
        
        {/* ==================== SIDEBAR ==================== */}
        <aside className="w-60 bg-[#0a041b] border-r border-purple-900/20 p-4 flex flex-col justify-between hidden lg:flex shrink-0">
          <div>
            <div className="text-center py-4 px-2 mb-4 bg-purple-950/20 border border-purple-900/30 rounded-xl">
              <p className="font-serif italic text-xs text-amber-200/80">
                "Same Universe, Different Questions, Always A Message."
              </p>
              <span className="text-amber-400 text-xs mt-1 block">✦</span>
            </div>
          </div>

          {/* Bottom Guidance Widget */}
          <div className="bg-gradient-to-b from-purple-950/30 to-purple-900/10 border border-purple-800/20 rounded-2xl p-4 text-center">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-sm mx-auto mb-2">
              ✦
            </div>
            <p className="text-xs font-semibold text-amber-200">Guidance</p>
            <p className="text-[10px] text-purple-300/50 my-1">
              is always one message away.
            </p>
            <button className="w-full mt-2 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-amber-300 text-[11px] font-medium py-1.5 rounded-lg transition-all flex items-center justify-center gap-1">
              Stay Connected <HiSparkles className="text-xs" />
            </button>
          </div>
        </aside>

        {/* ==================== MAIN CONTENT AREA ==================== */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto">
          
          {/* HERO BANNER HEADER */}
          <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#150a32] to-[#1d0b3e] border border-purple-800/30 p-8 overflow-hidden flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6 shadow-2xl">
            
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-0 right-1/3 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Title Block */}
            <div className="space-y-2 z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                ✦ SEND EMAIL ✦
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-white tracking-wide">
                Send an Email
              </h1>
              <p className="text-purple-200/70 text-xs lg:text-sm leading-relaxed">
                Connect with your loved ones, clients or anyone, instantly via Email.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3 text-[11px] text-amber-300/80 font-medium pt-2">
                <span>Fast</span> • <span>Secure</span> • <span>Reliable</span>
              </div>
            </div>

            {/* Right Mystic Artwork Graphic */}
            <div className="relative z-10 hidden sm:flex items-center justify-center">
              <div className="relative w-48 h-32 bg-gradient-to-b from-purple-900/40 to-transparent border border-purple-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-inner">
                <div className="w-14 h-14 rounded-full bg-purple-500/20 border border-amber-400/40 flex items-center justify-center text-2xl text-amber-300 shadow-lg shadow-purple-950/80 mb-2">
                  🔮
                </div>
                <p className="text-[11px] font-serif italic text-amber-200">
                  "A simple message can create a big change..." ✨
                </p>
              </div>
            </div>
          </div>

          {/* FORM AND INFO GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT: SEND EMAIL FORM (8 COLS) */}
            <div className="lg:col-span-8 bg-[#0e0724] border border-purple-900/40 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl relative">
              
              <div className="flex items-center gap-3 border-b border-purple-900/30 pb-4">
                <div className="p-2.5 rounded-xl bg-purple-900/40 border border-amber-400/30 text-amber-300 text-lg">
                  <FiMail />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-white text-lg">Send a New Email</h2>
                  <p className="text-xs text-purple-300/50">Write your subject and message to deliver via Nodemailer.</p>
                </div>
              </div>

              {/* Success / Error Status Alert */}
              {status.text && (
                <div
                  className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-medium ${
                    status.type === "success"
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                      : "bg-red-950/40 border-red-500/40 text-red-300"
                  }`}
                >
                  {status.type === "success" ? <FiCheckCircle className="text-base" /> : <FiAlertCircle className="text-base" />}
                  <span>{status.text}</span>
                </div>
              )}

              <form onSubmit={handleSendEmail} className="space-y-4">
                
                {/* Recipient Email (TO) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-purple-200/80">Recipient Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-sm" />
                    <input
                      type="email"
                      required
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="client@example.com"
                      className="w-full bg-[#080417] border border-purple-900/50 rounded-xl py-3 pl-11 pr-10 text-xs text-white placeholder-purple-300/30 focus:outline-none focus:border-amber-500/60 transition-all font-sans"
                    />
                    <FiUserCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300/40 text-sm" />
                  </div>
                </div>

                {/* Email Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-purple-200/80">Subject</label>
                  <div className="relative">
                    <FiType className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-sm" />
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Subject of the email"
                      className="w-full bg-[#080417] border border-purple-900/50 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-purple-300/30 focus:outline-none focus:border-amber-500/60 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-purple-200/80">Message Body</label>
                    <span className="text-[11px] text-purple-300/40 font-mono">
                      {message.length} chars
                    </span>
                  </div>
                  <div className="relative">
                    <FiEdit3 className="absolute left-4 top-4 text-purple-400 text-sm" />
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your email message here..."
                      className="w-full bg-[#080417] border border-purple-900/50 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-purple-300/30 focus:outline-none focus:border-amber-500/60 transition-all resize-none leading-relaxed"
                    ></textarea>
                  </div>
                </div>

                {/* Quick Templates */}
                <div className="space-y-2">
                  <span className="text-[11px] font-medium text-amber-300/80 flex items-center gap-1">
                    <HiSparkles /> Quick Templates
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {templates.map((tpl) => (
                      <button
                        key={tpl.label}
                        type="button"
                        onClick={() => handleTemplateClick(tpl.text)}
                        className="flex items-center justify-center gap-1.5 bg-[#140b2f] border border-purple-900/40 hover:border-amber-500/40 px-3 py-2 rounded-xl text-[11px] font-medium text-purple-200 hover:text-amber-200 transition-all active:scale-95 text-center"
                      >
                        <span className="text-amber-400 text-xs">{tpl.icon}</span>
                        <span>{tpl.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 disabled:opacity-50 text-black font-semibold text-xs py-3.5 rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer font-serif tracking-wider uppercase"
                >
                  <FiSend className="text-sm" /> {loading ? "Sending Email..." : "Send Email"}
                </button>

                {/* Security Note */}
                <p className="text-[10px] text-center text-purple-300/40 flex items-center justify-center gap-1.5">
                  <FiLock className="text-amber-400/80" /> Your email transmission is encrypted and secure.
                </p>
              </form>
            </div>

            {/* RIGHT: WHY SEND AN EMAIL (4 COLS) */}
            <div className="lg:col-span-4 bg-[#0e0724] border border-purple-900/40 rounded-2xl p-6 lg:p-8 flex flex-col justify-between space-y-6 shadow-xl">
              
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-purple-900/30 pb-4 mb-6">
                  <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-sm font-serif">
                    ✦
                  </div>
                  <h3 className="font-serif font-bold text-white text-base">Why Send an Email?</h3>
                </div>

                {/* Feature List */}
                <div className="space-y-5">
                  <FeatureItem
                    icon={<FiZap />}
                    title="Instant Delivery"
                    desc="Messages reach inbox in seconds."
                  />
                  <FeatureItem
                    icon={<FiShield />}
                    title="Secure & Private"
                    desc="Your data is always protected."
                  />
                  <FeatureItem
                    icon={<FiHeart />}
                    title="Stay Connected"
                    desc="Keep your client relationships strong."
                  />
                  <FeatureItem
                    icon={<FiGlobe />}
                    title="Global Reach"
                    desc="Send emails anywhere in the world."
                  />
                </div>
              </div>

              {/* Quote Footer Card */}
              <div className="bg-[#140a32] border border-purple-800/30 p-4 rounded-xl text-center relative overflow-hidden">
                <p className="font-serif italic text-xs text-amber-200/90 leading-relaxed">
                  “Sometimes, a few words are all it takes to make someone's day brighter.”
                </p>
                <span className="text-[10px] text-purple-300/50 block mt-2 font-serif">— Kripalini</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#080316] border-t border-purple-900/30 mt-auto pt-10 pb-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-purple-900/20 text-xs">
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-serif text-sm">
                ✦
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-amber-200 tracking-wider uppercase leading-none">
                  Kripalini
                </h4>
                <span className="text-[9px] text-purple-300/60 tracking-widest uppercase">
                  Tarot Reader
                </span>
              </div>
            </div>
            <p className="text-purple-300/60 text-[11px] leading-relaxed">
              Guiding souls with intuition, compassion and the timeless wisdom of Tarot.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-serif font-bold text-amber-300 text-xs tracking-wide">Quick Links</h5>
            <ul className="space-y-1.5 text-purple-300/60">
              <li><a href="#" className="hover:text-amber-200 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">Readings</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-serif font-bold text-amber-300 text-xs tracking-wide">Support</h5>
            <ul className="space-y-1.5 text-purple-300/60">
              <li><a href="#" className="hover:text-amber-200 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-serif font-bold text-amber-300 text-xs tracking-wide">Stay Connected</h5>
            
            <div className="flex items-center gap-2 text-purple-300/80">
              <SocialIcon icon={<FaInstagram />} />
              <SocialIcon icon={<FaFacebookF />} />
              <SocialIcon icon={<FaYoutube />} />
              <SocialIcon icon={<FaWhatsapp />} />
              <SocialIcon icon={<FaPinterestP />} />
            </div>

            <div className="flex items-center bg-[#130b2c] border border-purple-900/40 rounded-xl p-1">
              <input
                type="email"
                placeholder="Your email address"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                className="w-full bg-transparent px-3 py-1.5 text-[11px] text-white placeholder-purple-300/30 focus:outline-none"
              />
              <button className="bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold text-[10px] px-3 py-1.5 rounded-lg hover:brightness-110 transition-all shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-purple-300/40 gap-2">
          <p>© 2026 Kripalini Tarot Reader. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed with <FiHeart className="text-amber-400" /> for divine guidance.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-purple-900/40 border border-purple-700/30 flex items-center justify-center text-amber-400 text-xs shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-semibold text-white">{title}</h4>
        <p className="text-[11px] text-purple-300/50">{desc}</p>
      </div>
    </div>
  );
}

function SocialIcon({ icon }) {
  return (
    <a
      href="#"
      className="w-7 h-7 rounded-full bg-[#150a30] border border-purple-800/40 flex items-center justify-center hover:text-amber-300 hover:border-amber-400/40 transition-all text-xs"
    >
      {icon}
    </a>
  );
}