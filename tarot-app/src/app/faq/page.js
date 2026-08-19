"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Send,
  Lock,
  Clock,
  Heart,
  Globe,
  User,
  FileText,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/Component/Navigation/Navbar";

const featureHighlights = [
  {
    icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />,
    title: "100% Confidential",
    desc: "Your privacy is our top priority.",
  },
  {
    icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />,
    title: "Quick Response",
    desc: "We reply within 24 hours.",
  },
  {
    icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />,
    title: "Personalized Guidance",
    desc: "Readings tailored just for you.",
  },
  {
    icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />,
    title: "Compassionate Support",
    desc: "Here to support you on your journey.",
  },
  {
    icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />,
    title: "Global Clients",
    desc: "Helping beautiful souls worldwide.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
  };

  return (
    <div className="w-full bg-[#07040d] text-white font-sans overflow-hidden min-h-screen">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-amber-400 text-xs sm:text-sm">✦</span>
          <span className="text-amber-400 text-xs sm:text-sm tracking-widest uppercase font-semibold">
            GET IN TOUCH
          </span>
          <span className="text-amber-400 text-xs sm:text-sm">✦</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-amber-100 leading-tight mb-4">
          We’d Love to <br className="sm:hidden" />
          <span className="text-amber-300 font-normal">Hear From You</span>
        </h1>

        <div className="w-12 sm:w-16 h-[1px] bg-amber-400 mx-auto mb-5" />

        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light max-w-xl mx-auto mb-6">
          Have questions or ready to book your reading? We are here to guide and support you on your journey. Reach out and let's connect.
        </p>
      </section>

      {/* MAIN CONTACT & FORM SECTION */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SEND MESSAGE FORM */}
          <div className="lg:col-span-7 rounded-3xl bg-purple-950/20 border border-purple-500/20 p-6 sm:p-8 md:p-10 backdrop-blur-md">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-base sm:text-lg md:text-xl font-serif text-amber-200 flex items-center justify-center gap-2">
                <span className="text-amber-400 text-xs sm:text-sm">✦</span>
                <span>Send Us a Message</span>
                <span className="text-amber-400 text-xs sm:text-sm">✦</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400/70 absolute left-3.5 top-3.5 sm:top-4" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-xl pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="relative">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400/70 absolute left-3.5 top-3.5 sm:top-4" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-xl pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400/70 absolute left-3.5 top-3.5 sm:top-4" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-xl pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="relative">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400/70 absolute left-3.5 top-3.5 sm:top-4" />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-xl pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="relative">
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-zinc-400 pt-2">
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span>Your information is 100% secure and confidential.</span>
              </div>
            </form>
          </div>

          {/* LET'S CONNECT INFO CARD */}
          <div className="lg:col-span-5 rounded-3xl bg-purple-950/20 border border-purple-500/20 p-6 sm:p-8 md:p-10 backdrop-blur-md h-full flex flex-col justify-between">
            <div>
              <div className="text-center sm:text-left mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg md:text-xl font-serif text-amber-200 flex items-center gap-2 justify-center sm:justify-start">
                  <span>Let's Connect</span>
                  <span className="text-amber-400 text-xs sm:text-sm">✦</span>
                </h2>
              </div>

              <div className="space-y-6">
                {/* PHONE CARD ITEM */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-amber-400/40 bg-purple-900/40 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-serif text-amber-200 text-xs sm:text-sm font-semibold">Call / WhatsApp</h4>
                    <a 
                      href="tel:+917014997902" 
                      className="text-amber-100 font-bold text-sm sm:text-base mt-0.5 block hover:text-amber-300 transition-colors"
                    >
                      +91 70149 97902
                    </a>
                    <p className="text-[11px] sm:text-xs text-zinc-400 font-light mt-0.5">Available 10 AM – 8 PM (Mon – Sun)</p>
                  </div>
                </div>

                {/* EMAIL CARD ITEM */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-amber-400/40 bg-purple-900/40 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-serif text-amber-200 text-xs sm:text-sm font-semibold">Email</h4>
                    <a 
                      href="mailto:khushii27sharma@gmail.com" 
                      className="text-amber-100 font-medium text-xs sm:text-sm mt-0.5 block hover:text-amber-300 transition-colors break-all"
                    >
                      khushii27sharma@gmail.com
                    </a>
                    <p className="text-[11px] sm:text-xs text-zinc-400 font-light mt-0.5">We'll get back to you within 24 hours.</p>
                  </div>
                </div>

                {/* LOCATION CARD ITEM */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-amber-400/40 bg-purple-900/40 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-serif text-amber-200 text-xs sm:text-sm font-semibold">Location</h4>
                    <p className="text-amber-100 font-medium text-xs sm:text-sm mt-0.5">Jaipur, Rajasthan, India</p>
                    <p className="text-[11px] sm:text-xs text-zinc-400 font-light mt-0.5">Online Readings Available Worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="py-6 sm:py-8 px-4 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-purple-950/20 border border-purple-500/20 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {featureHighlights.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center gap-2">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-amber-400/30 bg-purple-900/30 flex items-center justify-center">
                {item.icon}
              </div>
              <h4 className="text-xs sm:text-sm font-serif font-bold text-amber-200 mt-1">{item.title}</h4>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-light leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-500/20 bg-[#040208] pt-12 sm:pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 text-sm">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              <h3 className="text-xl sm:text-2xl font-serif text-amber-200 font-bold">Kripalini</h3>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light mb-4">
              Providing professional Tarot readings and intuitive guidance.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-amber-200 text-base sm:text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-400 font-light">
              <li><Link href="/" className="hover:text-amber-300 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-amber-300 transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-amber-300 transition-colors">Services</Link></li>
              <li><Link href="/contact" className="hover:text-amber-300 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-amber-200 text-base sm:text-lg mb-4">Contact Info</h4>
            <div className="space-y-4 text-xs sm:text-sm text-zinc-400 font-light">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" /> 
                <a href="tel:+917014997902" className="hover:text-amber-300 transition-colors">+91 70149 97902</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" /> 
                <a href="mailto:khushii27sharma@gmail.com" className="hover:text-amber-300 transition-colors break-all">khushii27sharma@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" /> 
                <span>Jaipur, Rajasthan, India</span>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© 2026 Kripalini Tarot Reader. All Rights Reserved.</p>
          <div className="flex gap-4 mt-3 sm:mt-0">
             <Link href="/privacy" className="hover:text-amber-300">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-amber-300">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}