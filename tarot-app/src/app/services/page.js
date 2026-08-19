"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  Briefcase,
  DollarSign,
  Flower2,
  UserCheck,
  Sun,
  Users,
  Eye,
  Calendar,
  HelpCircle,
  Layers,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Globe
} from "lucide-react";
import Navbar from "@/Component/Navigation/Navbar";

// Services List Data
const servicesList = [
  {
    icon: <Heart className="w-6 h-6 text-amber-300" />,
    title: "Love & Relationships",
    description: "Understand your relationships better, attract true love and heal emotional wounds.",
  },
  {
    icon: <Briefcase className="w-6 h-6 text-amber-300" />,
    title: "Career Guidance",
    description: "Get clarity about your career path, job opportunities, growth and success.",
  },
  {
    icon: <DollarSign className="w-6 h-6 text-amber-300" />,
    title: "Finance & Wealth",
    description: "Find insights about your financial situation, abundance and prosperity.",
  },
  {
    icon: <Flower2 className="w-6 h-6 text-amber-300" />,
    title: "Health & Wellbeing",
    description: "Guidance for your physical, mental and emotional wellbeing.",
  },
  {
    icon: <UserCheck className="w-6 h-6 text-amber-300" />,
    title: "Spiritual Guidance",
    description: "Connect with your higher self and discover your soul's purpose.",
  },
  {
    icon: <Sun className="w-6 h-6 text-amber-300" />,
    title: "Life Purpose",
    description: "Uncover your true calling and life purpose. Know what the universe has planned.",
  },
  {
    icon: <Users className="w-6 h-6 text-amber-300" />,
    title: "Family & Friends",
    description: "Resolve conflicts and strengthen bonds with family and friends.",
  },
  {
    icon: <Eye className="w-6 h-6 text-amber-300" />,
    title: "General Reading",
    description: "A general reading to gain insight and clarity about any area of your life.",
  },
];

// Reading Process Data
const processSteps = [
  {
    step: 1,
    icon: <Calendar className="w-5 h-5 text-amber-300" />,
    title: "Book a Session",
    description: "Choose the service and time that works best for you.",
  },
  {
    step: 2,
    icon: <HelpCircle className="w-5 h-5 text-amber-300" />,
    title: "Share Your Question",
    description: "Share your concerns or questions before the reading.",
  },
  {
    step: 3,
    icon: <Layers className="w-5 h-5 text-amber-300" />,
    title: "Tarot Reading",
    description: "I perform an intuitive reading with deep focus and connection.",
  },
  {
    step: 4,
    icon: <Lightbulb className="w-5 h-5 text-amber-300" />,
    title: "Get Clarity",
    description: "Receive clear guidance, insights and practical advice.",
  },
  {
    step: 5,
    icon: <Sun className="w-5 h-5 text-amber-300" />,
    title: "Move Forward",
    description: "Use the guidance to make empowered decisions.",
  },
];

export default function ServicesPage() {
  const router = useRouter();
  return (
    <div className="w-full bg-[#07040d] text-white font-sans overflow-hidden">
      
      <Navbar />
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
              <span className="text-amber-400 text-xs tracking-widest uppercase font-semibold">Our Services</span>
              <span className="text-amber-400 text-xs">✦</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-amber-100 leading-tight mb-4">
              Guidance for Every <br />
              Aspect of <span className="text-amber-300 font-normal">Your Life</span>
            </h1>

            <div className="w-12 h-[1px] bg-amber-400 mb-6" />

            <p className="text-sm text-zinc-300 leading-relaxed max-w-lg font-light mb-8">
              Tarot is a mirror to your soul. Whatever your question, the cards provide clarity, direction and the wisdom you need to move forward.
            </p>

            <Link href="#services-grid">
              <button onClick={()=>router.push("/pricing")}  className="px-6 py-3 rounded-full border border-amber-400/50 bg-purple-950/40 hover:bg-amber-400 hover:text-zinc-950 text-amber-200 text-xs font-semibold transition-all flex items-center gap-2 shadow-xl">
                <span>Book Your Reading</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-4/3 rounded-4xl overflow-hidden border border-amber-400/30 bg-purple-950/20 backdrop-blur-sm p-2">
              <div className="w-full h-full rounded-xl overflow-hidden relative border border-amber-400/40 shadow-[0_0_50px_rgba(147,51,234,0.3)]">
                <Image
                  src="/images/logos/logo.jpg"
                  alt="Mystical Tarot Spread"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07040d] via-transparent to-transparent opacity-40" />
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="services-grid" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-amber-400 text-xs">✦</span>
            <span className="text-amber-400 text-xs tracking-widest uppercase font-medium">My Tarot Services</span>
            <span className="text-amber-400 text-xs">✦</span>
          </div>
          <p className="text-xs text-zinc-400 font-light">Choose the reading that aligns with your needs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl bg-purple-950/20 border border-purple-500/20 hover:border-amber-400/60 transition-all flex flex-col items-center text-center group bg-gradient-to-b from-purple-950/30 to-transparent"
            >
              <div className="w-14 h-14 rounded-full border border-amber-400/40 bg-purple-900/40 flex items-center justify-center mb-5 group-hover:border-amber-400 transition-colors shadow-inner">
                {service.icon}
              </div>

              <h3 className="text-base font-serif text-amber-200 mb-3">{service.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light mb-6 flex-grow">
                {service.description}
              </p>

              <Link href="#book">
                <button className="text-xs font-semibold text-amber-300 group-hover:text-amber-200 flex items-center gap-1.5 transition-colors">
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* READING PROCESS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-purple-950/20 border border-purple-500/20 p-8 sm:p-12 backdrop-blur-md">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-amber-400 text-xs">✦</span>
              <span className="text-amber-400 text-xs tracking-widest uppercase font-medium">My Reading Process</span>
              <span className="text-amber-400 text-xs">✦</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-amber-100">Simple & Sacred Steps</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
            {processSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center relative z-10">
                <div className="w-8 h-8 rounded-full bg-purple-900 border border-amber-400/60 text-amber-300 text-xs font-bold flex items-center justify-center mb-4 shadow-md">
                  {step.step}
                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mb-4">
                  {step.icon}
                </div>

                <h4 className="text-sm font-serif text-amber-200 mb-2">{step.title}</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-amber-400/40 p-8 sm:p-12 bg-gradient-to-r from-purple-950 via-[#120924] to-purple-950 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[0_0_50px_rgba(147,51,234,0.2)]">
          
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-2xl sm:text-4xl font-serif text-amber-100 mb-3">
              Ready to Receive Answers and <span className="text-amber-300 font-normal">Transform Your Life?</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-light mb-3">
              The universe is always guiding you. Let's uncover the messages meant for you.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Confidential & Safe</span>
            </div>
          </div>

          <button onClick={()=>router.push("/reading")} className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-xl flex items-center gap-2 shrink-0">
            <span>Book Your Reading Now</span>
            <Sparkles className="w-4 h-4 fill-zinc-950" />
          </button>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-500/20 bg-[#040208] pt-16 pb-8 px-4 sm:px-6 lg:px-8">
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
              <MessageCircle className="w-4 h-4 hover:text-amber-400 cursor-pointer" />
              <Globe className="w-4 h-4 hover:text-amber-400 cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-serif text-amber-200 text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-zinc-400 font-light">
              <li><Link href="/" className="hover:text-amber-300">Home</Link></li>
              <li><Link href="/about" className="hover:text-amber-300">About Us</Link></li>
              <li><Link href="/services" className="hover:text-amber-300">Services</Link></li>
              <li><Link href="#readings" className="hover:text-amber-300">Readings</Link></li>
              <li><Link href="#testimonials" className="hover:text-amber-300">Testimonials</Link></li>
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
            <h4 className="font-serif text-amber-200 text-sm mb-4">Get in Touch</h4>
            <div className="space-y-3 text-zinc-400 font-light">
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-amber-400" /> +91 98765 43210</div>
              <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-amber-400" /> "kripalini.tarot@gmail.com"</div>
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