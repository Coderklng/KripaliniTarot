"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Briefcase,
  DollarSign,
  Flower2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Zap,
  Tag,
  Star,
  Plus,
  Minus,
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";

// 1. Services Data
const servicesData = [
  {
    icon: <Heart className="w-6 h-6 text-amber-400" />,
    title: "Love & Relationships",
    description: "Get clarity about your love life, relationships and future partnership.",
  },
  {
    icon: <Briefcase className="w-6 h-6 text-amber-400" />,
    title: "Career Guidance",
    description: "Find the right path, growth opportunities and success in your career.",
  },
  {
    icon: <DollarSign className="w-6 h-6 text-amber-400" />,
    title: "Finance & Wealth",
    description: "Discover financial opportunities, stability and ways to increase abundance.",
  },
  {
    icon: <Flower2 className="w-6 h-6 text-amber-400" />,
    title: "Health & Wellbeing",
    description: "Guidance for your physical, mental and emotional well-being.",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-amber-400" />,
    title: "Spiritual Guidance",
    description: "Connect with your higher self and discover your soul's purpose.",
  },
];

// 2. Features Data
const featuresData = [
  { icon: <ShieldCheck className="w-5 h-5 text-amber-400" />, title: "Accurate & Honest" },
  { icon: <ShieldCheck className="w-5 h-5 text-amber-400" />, title: "100% Confidential & Safe" },
  { icon: <UserCheck className="w-5 h-5 text-amber-400" />, title: "Personalized Guidance" },
  { icon: <Zap className="w-5 h-5 text-amber-400" />, title: "Positive Energy & Healing" },
  { icon: <Tag className="w-5 h-5 text-amber-400" />, title: "Affordable Prices" },
];

// 3. Pricing Data
const pricingData = [
  {
    id: "basic",
    title: "Basic Reading",
    price: "₹499",
    rawPrice: 499,
    features: ["1 Question", "Detailed Answer", "15-20 Minutes"],
    isPopular: false,
  },
  {
    id: "premium",
    title: "Premium Reading",
    price: "₹999",
    rawPrice: 999,
    features: ["3 Questions", "In-depth Guidance", "30-40 Minutes"],
    isPopular: true,
  },
  {
    id: "full",
    title: "Full Reading",
    price: "₹1499",
    rawPrice: 1499,
    features: ["Unlimited Questions", "Detailed Guidance", "60 Minutes"],
    isPopular: false,
  },
];

// 4. FAQ Data
const faqData = [
  { question: "How does a Tarot reading work?", answer: "Tarot uses symbolic cards to tap into your current energy and provide spiritual insights for your future." },
  { question: "Is Tarot reading accurate?", answer: "Yes, Tarot offers profound clarity based on your current energies, choices, and underlying situations." },
  { question: "Will my personal information be safe?", answer: "Absolutely. All readings, discussions, and details shared remain 100% private and confidential." },
  { question: "How can I book a session?", answer: "Choose your preferred reading plan above, click 'Book Now', fill details, and pay via UPI or Cards." },
];

const SectionHeader = ({ title }) => (
  <div className="flex items-center justify-center gap-4 mb-12">
    <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-amber-400/60 to-amber-400" />
    <div className="flex items-center gap-2">
      <span className="text-amber-400 text-xs sm:text-sm animate-pulse">✦</span>
      <h2 className="text-2xl sm:text-4xl font-serif tracking-wider text-amber-200 drop-shadow-md">
        {title}
      </h2>
      <span className="text-amber-400 text-xs sm:text-sm animate-pulse">✦</span>
    </div>
    <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-amber-400/60 to-amber-400" />
  </div>
);

export default function TarotCard() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleOpenBooking = (plan) => {
    setSelectedPlan(plan);
    setPaymentSuccess(false);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setIsProcessing(false);
    setFormData({ name: "", email: "", phone: "" });
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };
  return (
    <div className="w-full bg-[#05030a] text-white font-sans overflow-hidden relative selection:bg-amber-400 selection:text-zinc-950">
      
      {/* BACKGROUND AMBIENT GLOWS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* NAVBAR */}
      <nav className="border-b border-purple-500/20 bg-[#07050d]/90 backdrop-blur-xl sticky top-0 z-40 shadow-lg shadow-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-purple-950 border border-amber-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.2)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xl font-serif text-amber-200 font-bold tracking-wide">Kripalini</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs text-zinc-300 font-medium">
            <a href="#home" className="hover:text-amber-300 transition-colors">Home</a>
            <a href="#services" className="hover:text-amber-300 transition-colors">Services</a>
            <a href="#why-us" className="hover:text-amber-300 transition-colors">Why Choose Us</a>
            <a href="#pricing" className="hover:text-amber-300 transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-amber-300 transition-colors">Contact</a>
          </div>
          <button
          onClick={()=>router.push("/pricing")}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-700 via-purple-600 to-amber-500 rounded-xl text-xs font-bold text-white hover:brightness-110 transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] cursor-pointer"
          >
            Book Session
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative py-24 px-4 text-center max-w-5xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-amber-400/40 text-amber-300 text-xs mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5" /> Divine Spiritual Guidance & Tarot Wisdom
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-amber-100 mb-6 leading-tight">
          Discover Your Destiny Through <span className="text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.4)]">TAROT</span>
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl mb-10 leading-relaxed">
          Unlock the hidden secrets of your life with authentic divine insights. Let the cards guide your path toward ultimate clarity, love, and success.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => handleOpenBooking(pricingData[1])}
            className="px-7 py-3.5 bg-gradient-to-r from-purple-700 via-purple-600 to-amber-500 rounded-2xl text-xs font-bold text-white shadow-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            Book a Reading <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#services"
            className="px-7 py-3.5 rounded-2xl text-xs font-semibold text-amber-200 bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/50 hover:border-amber-400/50 transition-all shadow-md"
          >
            Explore Services
          </a>
        </div>
      </section>

      {/* SECTION 1: MY SERVICES */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader title="My Services" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center text-center p-6 rounded-3xl bg-gradient-to-b from-purple-950/30 via-[#0a0514]/80 to-purple-950/20 border border-purple-500/20 hover:border-amber-400/60 transition-all duration-300 shadow-xl hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(147,51,234,0.2)]"
            >
              <div className="w-14 h-14 rounded-2xl border border-amber-400/40 bg-purple-950/80 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all">
                {service.icon}
              </div>
              <h3 className="text-base font-serif text-amber-100 mb-2 group-hover:text-amber-300">{service.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6 flex-grow">{service.description}</p>
              <button
                onClick={() => handleOpenBooking(pricingData[0])}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 cursor-pointer group-hover:translate-x-1 transition-transform"
              >
                Book Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: WHY CHOOSE KRIPALINI */}
      <section id="why-us" className="py-16 px-4 max-w-7xl mx-auto">
        <SectionHeader title="Why Choose Kripalini?" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuresData.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-center justify-center gap-3 p-5 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-center sm:text-left hover:border-amber-400/40 transition-all">
              <div className="p-2.5 rounded-xl bg-purple-900/40 border border-amber-400/30 shadow-md">{item.icon}</div>
              <span className="text-xs font-semibold text-zinc-200">{item.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CHOOSE YOUR READING (PRICING) */}
      <section id="pricing" className="py-20 px-4 max-w-7xl mx-auto">
        <SectionHeader title="Choose Your Reading" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingData.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 ${
                plan.isPopular
                  ? "bg-gradient-to-b from-purple-900/50 via-zinc-950 to-purple-950/80 border-2 border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.2)] md:-translate-y-2 z-10"
                  : "bg-purple-950/20 border border-purple-500/20 hover:border-amber-400/40"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-zinc-950 font-bold text-[10px] uppercase tracking-wider py-1.5 px-5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-serif text-amber-200 text-center mb-4">{plan.title}</h3>
              <div className="text-4xl font-bold text-amber-400 text-center mb-6 drop-shadow-sm">{plan.price}</div>
              <ul className="space-y-3.5 mb-8 flex-grow">
                {plan.features.map((feat, i) => (
                  <li key={i} className="text-xs text-zinc-300 flex items-center gap-2.5">
                    <span className="text-amber-400">✦</span> {feat}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleOpenBooking(plan)}
                className={`w-full py-3.5 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  plan.isPopular
                    ? "bg-gradient-to-r from-purple-700 to-amber-500 hover:brightness-110 text-white"
                    : "bg-purple-900/60 hover:bg-purple-800 text-amber-200 border border-purple-500/30"
                }`}
              >
                Book Now <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: FAQ & CONTACT FORM */}
      <section id="contact" className="py-20 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6">
          <h3 className="text-2xl font-serif text-amber-200 mb-6">Frequently Asked Questions</h3>
          <div className="space-y-3.5">
            {faqData.map((faq, i) => (
              <div key={i} className="border border-purple-500/20 rounded-2xl bg-purple-950/20 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4.5 text-left text-xs sm:text-sm font-medium text-amber-100 hover:text-amber-300 cursor-pointer"
                >
                  {faq.question}
                  {openFaq === i ? <Minus className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4 text-amber-400" />}
                </button>
                {openFaq === i && (
                  <div className="p-4.5 pt-0 text-xs text-zinc-400 leading-relaxed border-t border-purple-500/10">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 bg-purple-950/20 border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
          <h3 className="text-2xl font-serif text-amber-200 mb-6">Get in Touch</h3>

          <div className="space-y-3 mb-6 text-xs text-zinc-300">
            <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-amber-400" /> <span>+91 98765 43210</span></div>
            <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-amber-400" /> <span>khushii27sharma@gmail.com</span></div>
            <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-amber-400" /> <span>Jaipur, Rajasthan, India</span></div>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Your Name" className="w-full bg-zinc-900/90 border border-purple-500/30 rounded-xl p-3.5 text-xs text-white focus:border-amber-400 focus:outline-none shadow-inner" />
              <input type="email" placeholder="Your Email" className="w-full bg-zinc-900/90 border border-purple-500/30 rounded-xl p-3.5 text-xs text-white focus:border-amber-400 focus:outline-none shadow-inner" />
            </div>
            <textarea rows="3" placeholder="Your Message" className="w-full bg-zinc-900/90 border border-purple-500/30 rounded-xl p-3.5 text-xs text-white focus:border-amber-400 focus:outline-none shadow-inner"></textarea>
            <button onClick={()=>router.push("/contact")} className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-purple-500 hover:brightness-110 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg cursor-pointer">
              Send Message <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>

      {/* SECTION 5: FOOTER WITH LEGAL LINKS */}
      <footer className="border-t border-purple-500/20 bg-[#040308] pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 text-xs">
          <div>
            <h3 className="text-lg font-serif text-amber-300 mb-3 font-bold">Kripalini Tarot Reader</h3>
            <p className="text-zinc-400 leading-relaxed">Guiding your path with ancient Tarot wisdom, intuition, and compassionate energy.</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-200 mb-3 tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-zinc-400">
              <li><a href="#home" className="hover:text-amber-300 transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-amber-300 transition-colors">Services</a></li>
              <li><a href="#why-us" className="hover:text-amber-300 transition-colors">Why Us</a></li>
              <li><a href="#pricing" className="hover:text-amber-300 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-200 mb-3 tracking-wide">Legal Policies</h4>
            <ul className="space-y-2.5 text-zinc-400">
              <li><a href="/terms" className="hover:text-amber-300 transition-colors">Terms and Conditions</a>[cite: 1]</li>
              <li><a href="/privacy" className="hover:text-amber-300 transition-colors">Privacy Policy</a>[cite: 1]</li>
              <li><a href="/refund-policy" className="hover:text-amber-300 transition-colors">Refund and Cancellation</a>[cite: 1]</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-200 mb-3 tracking-wide">Newsletter</h4>
            <p className="text-zinc-400 mb-3">Subscribe for updates & special offers.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="bg-zinc-900 border border-purple-500/30 rounded-xl p-2.5 text-xs w-full text-white focus:outline-none focus:border-amber-400" />
              <button className="bg-amber-400 text-zinc-950 p-2.5 rounded-xl font-bold cursor-pointer hover:bg-amber-300 transition-colors"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500">
          <p>© 2026 Kripalini Tarot Reader. All Rights Reserved.</p>
          <div className="flex items-center gap-4 mt-3 sm:mt-0">
            <a href="#" className="hover:text-amber-300 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" className="hover:text-amber-300 transition-colors"><MessageCircle className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>

      {/* PAYMENT & BOOKING MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0d071a] border border-amber-400/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(147,51,234,0.3)]">
            
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-purple-950/60 border border-amber-400/30 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!paymentSuccess ? (
              <>
                <div className="text-center mb-6">
                  <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Book Session</span>
                  <h3 className="text-2xl font-serif text-amber-200 mt-1">{selectedPlan.title}</h3>
                  <p className="text-3xl font-bold text-amber-400 mt-2">{selectedPlan.price}</p>
                </div>

                <form onSubmit={handlePayNow} className="space-y-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full Name"
                      className="w-full bg-zinc-900/90 border border-purple-500/30 rounded-xl p-3.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email Address"
                        className="w-full bg-zinc-900/90 border border-purple-500/30 rounded-xl p-3.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="WhatsApp Phone No."
                        className="w-full bg-zinc-900/90 border border-purple-500/30 rounded-xl p-3.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-medium text-amber-200 mb-2 block">Select Payment Method:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          paymentMethod === "upi"
                            ? "bg-purple-900/80 border-amber-400 text-amber-300"
                            : "bg-zinc-900/50 border-purple-500/20 text-zinc-400"
                        }`}
                      >
                        <QrCode className="w-4 h-4" /> UPI / QR Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          paymentMethod === "card"
                            ? "bg-purple-900/80 border-amber-400 text-amber-300"
                            : "bg-zinc-900/50 border-purple-500/20 text-zinc-400"
                        }`}
                      >
                        <CreditCard className="w-4 h-4" /> Cards / Netbanking
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-700 via-purple-600 to-amber-500 hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    {isProcessing ? (
                      <span className="animate-pulse">Processing Payment...</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" /> Pay {selectedPlan.price} Securely
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-zinc-500 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-400" /> 256-Bit SSL Encrypted & Confidential
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
                <h3 className="text-2xl font-serif text-amber-200">Booking Confirmed!</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Thank you <strong className="text-amber-300">{formData.name}</strong>! Your booking for{" "}
                  <strong className="text-amber-400">{selectedPlan.title}</strong> is confirmed. We will contact you via WhatsApp shortly to share your slot time.
                </p>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs hover:bg-amber-300 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}