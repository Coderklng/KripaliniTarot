"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie"; // 👈 js-cookie import kiya
import {
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Heart,
  Clock,
  Star,
  Phone,
  Mail,
  MapPin,
  Globe,
  Share2,
  MessageCircle,
  Loader2,
  QrCode,
  CreditCard,
  X,
  Copy,
} from "lucide-react";
import Navbar from "@/Component/Navigation/Navbar";

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "kripalini@upi";

const pricingPlans = [
  {
    id: "basic",
    name: "BASIC READING",
    price: 499,
    displayPrice: "₹499",
    duration: "20-30 Minutes Session",
    durationInSeconds: 1800,
    tagline: "Perfect for quick clarity and answers to your questions.",
    isPopular: false,
    features: [
      "1 Question",
      "Tarot Card Reading",
      "General Guidance",
      "Session Summary (Text)",
      "Email Support",
    ],
    buttonText: "Book Now",
    icon: <Sparkles className="w-6 h-6 text-amber-300" />,
  },
  {
    id: "premium",
    name: "PREMIUM READING",
    price: 999,
    displayPrice: "₹999",
    duration: "45-60 Minutes Session",
    durationInSeconds: 3600,
    tagline: "In-depth answers and guidance for multiple areas of your life.",
    isPopular: true,
    features: [
      "3 Questions",
      "Detailed Tarot Reading",
      "Love, Career, Finance Guidance",
      "Chakra & Energy Insights",
      "Personalized Remedies",
      "Session Summary (PDF)",
      "Priority Support",
    ],
    buttonText: "Book Now",
    icon: <Star className="w-6 h-6 text-amber-300" />,
  },
  {
    id: "premium-plus",
    name: "PREMIUM PLUS",
    price: 1499,
    displayPrice: "₹1499",
    duration: "90 Minutes Session",
    durationInSeconds: 5400,
    tagline: "A complete transformational experience for deep clarity and life alignment.",
    isPopular: false,
    features: [
      "Unlimited Questions",
      "Comprehensive Tarot Reading",
      "Love, Career, Finance, Health, Spiritual",
      "Life Purpose & Soul Guidance",
      "Chakra & Aura Analysis",
      "Personalized Remedies & Rituals",
      "Session Summary (PDF)",
      "1 Follow-up Session (15 Min)",
      "24/7 Priority Support",
    ],
    buttonText: "Book Now",
    icon: <Heart className="w-6 h-6 text-amber-300" />,
  },
];

const comparisonData = [
  { feature: "Tarot Card Reading", basic: "✓", premium: "✓", premiumPlus: "✓" },
  { feature: "Multiple Questions", basic: "1 Question", premium: "3 Questions", premiumPlus: "Unlimited" },
  { feature: "Detailed Life Areas", basic: "General", premium: "Love, Career, Finance", premiumPlus: "Love, Career, Finance, Health, Spiritual" },
  { feature: "Remedies & Guidance", basic: "--", premium: "✓", premiumPlus: "✓" },
  { feature: "Session Summary", basic: "Text", premium: "PDF", premiumPlus: "PDF" },
  { feature: "Follow-up Support", basic: "--", premium: "--", premiumPlus: "1 Follow-up (15 Min)" },
  { feature: "Priority Support", basic: "--", premium: "✓", premiumPlus: "✓" },
];

const valueHighlights = [
  { icon: <ShieldCheck className="w-5 h-5 text-amber-400" />, title: "100% Confidential & Safe" },
  { icon: <Heart className="w-5 h-5 text-amber-400" />, title: "Guidance with Compassion" },
  { icon: <Star className="w-5 h-5 text-amber-400" />, title: "Accurate & Honest Readings" },
  { icon: <Clock className="w-5 h-5 text-amber-400" />, title: "Available 24/7" },
  { icon: <Sparkles className="w-5 h-5 text-amber-400" />, title: "Positive Energy & Transformation" },
];

export default function PricingPage() {
  const router = useRouter();
  const [selectedGateway, setSelectedGateway] = useState("razorpay");
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [isSubmittingQr, setIsSubmittingQr] = useState(false);

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector(
        "script[src='https://checkout.razorpay.com/v1/checkout.js']"
      );
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true));
        existingScript.addEventListener("error", () => resolve(false));
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const createBackendOrder = async (plan, gateway) => {
    // 👈 js-cookie se token fetch kiya (cookie ka naam yahan 'token' rakha hai, agar kuch aur ho toh change kar lena)
    const token = Cookies.get("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/transactions/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        amount: plan.price,
        totalAmount: plan.price,
        orderType: "service",
        paymentGateway: gateway,
        paymentMethod: gateway,
        planName: plan.name,
        planId: plan.id,
        orderItems: [
          {
            name: plan.name,
            price: plan.price,
            quantity: 1,
            planId: plan.id,
          },
        ],
        serviceDetails: {
          planId: plan.id,
          planName: plan.name,
          durationInSeconds: plan.durationInSeconds || 1800,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Order Creation Failed");
    }

    const mongoOrderId = data.order?._id || data.orderId || data._id || data.id;

    if (!mongoOrderId) {
      throw new Error("Invalid Order ID returned from server");
    }

    sessionStorage.setItem("activeOrderId", mongoOrderId);
    return { data, mongoOrderId };
  };

  const handlePayment = async (plan) => {
    const token = Cookies.get("token");

    if (!token) {
      alert("Please login first to book a session!");
      return;
    }

    setLoadingPlanId(plan.id);

    try {
      const { data, mongoOrderId } = await createBackendOrder(plan, selectedGateway);
      setCurrentOrderId(mongoOrderId);

      if (selectedGateway === "qr") {
        setActivePlan(plan);
        setShowQrModal(true);
        setLoadingPlanId(null);
        return;
      }

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setLoadingPlanId(null);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount || plan.price * 100,
        currency: data.currency || "INR",
        name: "Kripalini Tarot Reader",
        description: `${plan.name} Booking`,
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            const targetOrderId = mongoOrderId || sessionStorage.getItem("activeOrderId");
            const currentToken = Cookies.get("token");

            const verifyRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/transactions/razorpay/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
                },
                body: JSON.stringify({
                  orderId: targetOrderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              const verifiedOrderId = verifyData.orderId || verifyData.order?._id || targetOrderId;

              sessionStorage.removeItem("activeOrderId");
              setLoadingPlanId(null);

              router.push(`/booking/session-setup?orderId=${verifiedOrderId}`);
            } else {
              setLoadingPlanId(null);
              alert("Payment Verification Failed: " + (verifyData.message || "Invalid signature"));
            }
          } catch (err) {
            console.error("Verification Error:", err);
            setLoadingPlanId(null);
            alert("Verification failed due to network error.");
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingPlanId(null);
          },
        },
        theme: { color: "#07040d" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert(err.message || "Something went wrong during payment processing!");
      setLoadingPlanId(null);
    }
  };

  const handleConfirmQrPayment = async () => {
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length !== 12) {
      alert("Please enter a valid 12-digit UTR / Transaction Reference Number!");
      return;
    }

    const token = Cookies.get("token");
    const activeOrderId = currentOrderId || sessionStorage.getItem("activeOrderId");

    if (!activeOrderId) {
      alert("Order ID not found. Please try booking again.");
      return;
    }

    setIsSubmittingQr(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/transactions/upi/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          orderId: activeOrderId,
          utrNumber: cleanUtr,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const finalOrderId = data.orderId || data.order?._id || activeOrderId;

        sessionStorage.removeItem("activeOrderId");
        setShowQrModal(false);
        setUtrNumber("");
        router.push(`/chats/user?orderId=${finalOrderId}`);
      } else {
        alert(data.message || "UTR Verification failed. Please check your transaction number and try again.");
      }
    } catch (err) {
      console.error("QR Verification Error:", err);
      alert("Network error while verifying UTR. Please try again.");
    } finally {
      setIsSubmittingQr(false);
    }
  };

  return (
    <div className="w-full bg-[#07040d] text-white font-sans overflow-hidden min-h-screen">
      <Navbar />

      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-amber-400 text-xs">✦</span>
          <span className="text-amber-400 text-xs tracking-widest uppercase font-semibold">
            PRICING PLANS
          </span>
          <span className="text-amber-400 text-xs">✦</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif text-amber-100 leading-tight mb-4">
          Choose the Reading That <br />
          <span className="text-amber-300 font-normal">Resonates With You</span>
        </h1>

        <div className="w-12 h-[1px] bg-amber-400 mx-auto mb-4" />

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light max-w-xl mx-auto mb-8">
          Different journeys, different needs. Find the perfect reading experience for clarity, guidance, and transformation.
        </p>

        {/* Payment Mode Selection */}
        <div className="max-w-md mx-auto mb-10 p-5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-left shadow-lg">
          <label className="block text-xs text-zinc-300 mb-2 font-medium">
            Select Payment Method:
          </label>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedGateway("razorpay")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                selectedGateway === "razorpay"
                  ? "bg-amber-400/10 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                  : "bg-purple-950/20 border-purple-500/20 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Razorpay (Cards/UPI)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedGateway("qr")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                selectedGateway === "qr"
                  ? "bg-amber-400/10 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                  : "bg-purple-950/20 border-purple-500/20 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Direct QR / UPI</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -6 }}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all ${
                plan.isPopular
                  ? "bg-gradient-to-b from-purple-950/70 via-purple-900/40 to-purple-950/80 border-2 border-amber-400/80 shadow-[0_0_40px_rgba(217,119,6,0.2)] z-10"
                  : "bg-purple-950/20 border border-purple-500/20 hover:border-amber-400/40"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-bold uppercase tracking-widest shadow-md">
                  MOST POPULAR
                </div>
              )}

              <div>
                <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-purple-900/30 mx-auto flex items-center justify-center mb-4">
                  {plan.icon}
                </div>

                <h3 className="text-sm font-serif font-semibold text-amber-200 tracking-wider mb-2 uppercase">
                  {plan.name}
                </h3>

                <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-100 mb-2">
                  {plan.displayPrice}
                </div>

                <div className="inline-block px-3 py-1 rounded-full bg-purple-900/50 border border-purple-500/30 text-[11px] text-amber-300 mb-4 font-medium">
                  {plan.duration}
                </div>

                <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6 min-h-[36px]">
                  {plan.tagline}
                </p>

                <div className="w-full h-[1px] bg-purple-500/20 mb-6" />

                <ul className="space-y-3 text-left mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 font-light">
                      <div className="w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/60 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-amber-300" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handlePayment(plan)}
                disabled={loadingPlanId === plan.id}
                className={`w-full py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  plan.isPopular
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold shadow-lg"
                    : "border border-amber-400/40 bg-purple-950/40 hover:bg-amber-400 hover:text-zinc-950 text-amber-200"
                }`}
              >
                {loadingPlanId === plan.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                ) : (
                  <>
                    <span>
                      {selectedGateway === "qr" ? "Pay via QR" : plan.buttonText}
                    </span>
                    {selectedGateway === "qr" ? (
                      <QrCode className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {showQrModal && activePlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl bg-[#0c0716] border border-purple-500/30 p-6 text-center shadow-2xl"
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-serif text-amber-200 mb-1">
                Scan & Pay {activePlan.displayPrice}
              </h3>
              <p className="text-xs text-zinc-400 mb-2">
                Scan with GPay, PhonePe, Paytm, or any UPI App
              </p>

              {/* Dynamic QR Code Generation */}
              <div className="bg-white p-3 rounded-2xl inline-block mb-3 shadow-inner relative w-48 h-48 mx-auto flex items-center justify-center">
                <Image
                  src="/images/UPI/upi-qr.jpeg"
                  alt="Dynamic UPI QR Code"
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              </div>

              {/* Amount alert text */}
              <div className="text-xs text-amber-300 font-medium mb-3 bg-amber-400/10 border border-amber-400/20 py-1.5 px-3 rounded-lg">
                Amount Fixed: <span className="text-white font-bold">{activePlan.displayPrice}</span>
              </div>

              <div className="flex items-center justify-between bg-purple-950/40 border border-purple-500/20 rounded-xl px-3 py-2 text-xs text-zinc-300 mb-4">
                <span className="font-mono">{UPI_ID}</span>
                <button
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              <div className="mb-5 text-left">
                <label className="block text-[11px] text-zinc-300 mb-1 font-medium">
                  Enter UTR / Transaction Reference No. (12 digits):
                </label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="e.g. 3241XXXXXXXX"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2 bg-purple-950/40 border border-purple-500/30 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <button
                onClick={handleConfirmQrPayment}
                disabled={isSubmittingQr}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingQr ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Submit Payment & Start Chat</span>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-purple-950/20 border border-purple-500/20 p-6 sm:p-8 backdrop-blur-md overflow-x-auto">
          <div className="text-center sm:text-left mb-6">
            <h3 className="text-lg font-serif text-amber-200 flex items-center justify-center sm:justify-start gap-2">
              Compare & Choose What&apos;s Best For You <span className="text-amber-400 text-xs">✦</span>
            </h3>
          </div>

          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-purple-500/20 text-amber-300 font-serif">
                <th className="pb-4 font-normal">Feature</th>
                <th className="pb-4 text-center font-normal">BASIC</th>
                <th className="pb-4 text-center font-normal">PREMIUM</th>
                <th className="pb-4 text-center font-normal">PREMIUM PLUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10 text-zinc-300 font-light">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-purple-900/10 transition-colors">
                  <td className="py-3.5 text-zinc-200">{row.feature}</td>
                  <td className="py-3.5 text-center">{row.basic}</td>
                  <td className="py-3.5 text-center text-amber-200/90">{row.premium}</td>
                  <td className="py-3.5 text-center text-amber-300 font-medium">{row.premiumPlus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-8 px-4 max-w-6xl mx-auto">
        <div className="rounded-2xl bg-purple-950/30 border border-purple-500/20 p-4 sm:p-6 grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {valueHighlights.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center gap-2 p-2">
              <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center">
                {val.icon}
              </div>
              <span className="text-[11px] text-zinc-300 font-light leading-tight">{val.title}</span>
            </div>
          ))}
        </div>
      </section>

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
              <li><Link href="/pricing" className="hover:text-amber-300">Pricing</Link></li>
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
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>kripalini.tarot@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Jaipur, Rajasthan, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500">
          <p>© 2026 Kripalini Tarot Reader. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0">
            Designed with <Heart className="w-3 h-3 text-red-500 inline mx-0.5 fill-red-500" /> for divine guidance
          </p>
        </div>
      </footer>
    </div>
  );
}
