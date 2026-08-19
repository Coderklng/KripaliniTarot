"use client";

import { useState, useEffect, useRef } from "react";
import {
  FiBookOpen,
  FiCreditCard,
  FiMessageSquare,
  FiUser,
  FiSettings,
  FiBell,
  FiChevronDown,
  FiEdit2,
  FiCamera,
  FiMapPin,
  FiLock,
  FiSliders,
  FiCheckCircle,
  FiHeadphones,
  FiArrowRight,
  FiLoader,
  FiSun,
  FiShield
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function TarotProfilePage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [subTab, setSubTab] = useState("Personal Information");
  
  // States for user profile, orders/transactions, and kundli data
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [kundliData, setKundliData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const fileInputRef = useRef(null);

  // Edit Modal States
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState(""); // Fixed tiny syntax check

  const [notifs, setNotifs] = useState({
    email: true,
    sms: true,
    marketing: false,
    reminders: true,
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Helper Function to Get Token from Cookies
  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // 1. Fetch User Profile, Orders & Kundli Data from Backend using Cookies Token
  useEffect(() => {
    async function fetchData() {
      try {
        // Token ko cookies se get kar rahe hain (Yahan apne cookie ka naam 'token' ki jagah change kar sakte hain agar kuch aur ho jaise 'authToken')
        const token = getCookie("token"); 
        
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        };

        // Fetch User Profile
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/auth/profile`, { headers, credentials: "include" });
        const profileData = await profileRes.json();

        // Fetch User Orders / Transactions
        const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/orders/myorders`, { headers, credentials: "include" });
        const ordersData = await ordersRes.json();

        // Fetch User Kundli / Remedies
        const kundliRes = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/kundli/mykundlis`, { headers, credentials: "include" }).catch(() => null);
        const kundliJson = kundliRes && kundliRes.ok ? await kundliRes.json() : [
          { _id: "k1", name: "Ananya Sharma's Birth Chart", rashi: "Vrishabha (Taurus)", nakshatra: "Rohini", gemstone: "Diamond / Opal", rudraksha: "5 Mukhi", status: "Analyzed" },
          { _id: "k2", name: "Career Growth Kundli", rashi: "Simha (Leo)", nakshatra: "Magha", gemstone: "Ruby", rudraksha: "12 Mukhi", status: "Active Remedy" }
        ];

        if (profileRes.ok) {
          setUser(profileData);
          if (profileData.preferences) {
            setNotifs(profileData.preferences);
          }
        }

        if (ordersRes.ok) {
          setOrders(ordersData);
          const calculatedSpent = ordersData.reduce((acc, order) => {
            return acc + (order.transactionPrice || order.amount || order.totalAmount || 0);
          }, 0);
          setTotalSpent(calculatedSpent);
        }

        setKundliData(kundliJson);
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("Server connection error!");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle Save Edit to Backend Database (Using Cookies)
  const handleSaveEdit = async () => {
    try {
      const token = getCookie("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/auth/profile`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify({ [editField]: editValue })
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        showToast(`${editField.toUpperCase()} updated successfully! ✨`);
        setIsEditing(false);
      } else {
        showToast(data.message || "Failed to update");
      }
    } catch (error) {
      console.error("Update error:", error);
      showToast("Server error during update!");
    }
  };

  // Handle Avatar Image Upload locally & preview
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, avatar: reader.result }));
        showToast("Avatar updated successfully! ✨");
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070314] flex flex-col items-center justify-center text-amber-300 font-serif text-sm gap-3">
        <FiLoader className="animate-spin text-2xl" />
        Loading profile, transactions & kundli charts from cookies... ✨
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070314] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black flex flex-col relative">
      
      {/* Hidden File Input for Avatar Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-purple-950 border border-amber-500 text-amber-300 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <HiSparkles className="text-amber-400" /> {toast}
        </div>
      )}

      {/* EDIT MODAL POPUP */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0722] border border-purple-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-base font-serif font-bold text-amber-300 uppercase">
              Edit {editField}
            </h3>
            
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-[#130b2c] border border-purple-900/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              placeholder={`Enter new ${editField}`}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-600 hover:opacity-90 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TOP NAVBAR ================= */}
      <header className="bg-[#0b051e]/80 backdrop-blur-md border-b border-purple-900/30 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            My Profile & Kundli
          </h1>
          <p className="text-xs text-purple-300/50 hidden md:block border-l border-purple-900/40 pl-3">
            Home <span className="text-purple-300/30 mx-1">›</span> Profile & Astrology
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-purple-300/80 hover:text-white transition-colors cursor-pointer" onClick={() => showToast("You have notifications")}>
            <FiBell className="text-base" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-purple-600 border border-[#070314] text-[9px] font-bold text-white rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          {/* User Profile Badge Top Right */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-purple-900/40 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <p className="text-xs font-semibold text-white">Hello, {user?.name?.split(" ")[0] || "User"}</p>
              <p className="text-[10px] text-purple-300/60 font-medium">Astrology Member</p>
            </div>
            <FiChevronDown className="text-xs text-purple-300/40 hidden lg:block" />
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="flex flex-1">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="w-64 bg-[#070314] border-r border-purple-900/20 p-4 flex flex-col justify-between hidden lg:flex shrink-0">
          <div>
            {/* Brand Logo */}
            <div className="flex items-center gap-3 px-2 mb-8 mt-2">
              <div className="w-10 h-10 rounded-full bg-purple-900/40 border border-purple-700/40 flex items-center justify-center text-amber-300 font-serif text-lg">
                ✦
              </div>
              <div>
                <h2 className="font-serif text-sm font-bold text-white tracking-wider uppercase leading-none">
                  User Panel
                </h2>
                <span className="text-[9px] text-purple-300/60 tracking-widest uppercase">
                  Astro & Tarot
                </span>
              </div>
            </div>

           <nav className="space-y-1.5 text-xs font-medium">
              {[
                { icon: <FiUser />, label: "Profile", active: true }].map((item) => (
                <div
                  key={item.label}
                  onClick={() => {
                    setActiveTab(item.label);
                    showToast(`Switched to ${item.label}`);
                  }}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer transition-all ${
                    activeTab === item.label
                      ? "bg-gradient-to-r from-purple-900/70 to-purple-950/20 border border-purple-500/30 text-amber-300 font-semibold shadow-md"
                      : "text-purple-300/60 hover:text-white hover:bg-purple-900/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Need Help Footer Widget */}
          <div className="mt-4 bg-[#0d0722]/80 border border-purple-900/40 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center text-amber-400">
                <FiHeadphones />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Need Help?</p>
                <p className="text-[9px] text-purple-300/60">Astrologer Support 24/7</p>
              </div>
            </div>
            <button
              onClick={() => showToast("Connecting to astrologer support...")}
              className="w-full bg-[#130b2c] border border-purple-800/40 hover:border-amber-500/50 text-amber-300 text-[11px] font-medium py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Consult Astrologer
            </button>
          </div>
        </aside>

        {/* ================= RIGHT CONTENT AREA ================= */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto">
          
          {/* TOP HERO BANNER */}
          <div className="relative bg-gradient-to-r from-[#120826] via-[#1a0c36] to-[#0c051d] border border-purple-900/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row items-center gap-6 z-10 text-center sm:text-left">
              <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-indigo-500 to-purple-400 shadow-2xl">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 p-2 bg-purple-700 hover:bg-purple-600 text-white rounded-full shadow-lg transition-colors cursor-pointer"
                  title="Upload Custom Image"
                >
                  <FiCamera className="text-xs font-bold" />
                </button>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <h2 className="text-2xl font-serif font-bold text-white">{user?.name || "User Name"}</h2>
                </div>
                <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <p className="text-xs text-purple-200/70">
                    Active Astro Account
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current.click()}
              className="z-10 px-4 py-2 bg-purple-900/60 hover:bg-purple-900 border border-purple-500/40 rounded-xl text-xs text-amber-300 font-medium flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <FiCamera className="text-xs" /> Change Photo
            </button>
          </div>

          {/* ================= 4 STATS CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-5 shadow-xl relative group hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-900/40 border border-purple-700/30 text-amber-400 rounded-xl">
                  <FiBookOpen className="text-lg" />
                </div>
                <span className="text-2xl font-serif font-bold text-white">{user?.readingsCount ?? 12}</span>
              </div>
              <p className="text-xs font-bold text-white">Total Readings Completed</p>
            </div>

            <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-5 shadow-xl relative group hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-900/40 border border-purple-700/30 text-amber-400 rounded-xl">
                  <HiSparkles className="text-lg" />
                </div>
                <span className="text-2xl font-serif font-bold text-white">{orders.length}</span>
              </div>
              <p className="text-xs font-bold text-white">Total Orders Placed</p>
            </div>

            <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-5 shadow-xl relative group hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-900/40 border border-purple-700/30 text-amber-300 rounded-xl">
                  <FiSun className="text-lg" />
                </div>
                <span className="text-2xl font-serif font-bold text-white">{kundliData.length}</span>
              </div>
              <p className="text-xs font-bold text-white">Saved Kundli Charts</p>
            </div>

            <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-5 shadow-xl relative group hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-900/40 border border-purple-700/30 text-rose-400 rounded-xl">
                  <FiCreditCard className="text-lg" />
                </div>
                <span className="text-2xl font-serif font-bold text-white">₹{totalSpent}</span>
              </div>
              <p className="text-xs font-bold text-white">Total Spent</p>
            </div>

          </div>

          {/* ================= SUB-TABS BAR ================= */}
          <div className="flex items-center gap-6 border-b border-purple-900/40 overflow-x-auto pb-1 text-xs font-medium">
            {[
              "Personal Information",
              "Kundli & Remedies",
              "Address",
              "Payment Methods",
              "Preferences",
              "Security",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setSubTab(tab);
                  showToast(`Switched to ${tab}`);
                }}
                className={`py-3 transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  subTab === tab
                    ? "border-amber-400 text-amber-300 font-semibold"
                    : "border-transparent text-purple-300/60 hover:text-white"
                }`}
              >
                {tab === "Personal Information" && <FiUser className="text-xs" />}
                {tab === "Kundli & Remedies" && <FiSun className="text-xs text-amber-400" />}
                {tab === "Address" && <FiMapPin className="text-xs" />}
                {tab === "Payment Methods" && <FiCreditCard className="text-xs" />}
                {tab === "Preferences" && <FiSliders className="text-xs" />}
                {tab === "Security" && <FiLock className="text-xs" />}
                <span>{tab}</span>
              </button>
            ))}
          </div>

          {/* ================= CONDITIONAL RENDERING BASED ON SUBTAB ================= */}
          {subTab === "Kundli & Remedies" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-[#0d0722] border border-purple-900/40 rounded-2xl p-6 shadow-xl">
                <div>
                  <h3 className="text-base font-serif font-bold text-amber-300 flex items-center gap-2">
                    <FiSun className="text-amber-400" /> Your Birth Charts & Astrological Remedies
                  </h3>
                  <p className="text-xs text-purple-300/60 mt-1">
                    Access your saved Kundlis, check planetary alignments, and view gemstone or mantra remedies recommended for you.
                  </p>
                </div>
                <button
                  onClick={() => showToast("Opening New Kundli Generator...")}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-purple-600 hover:opacity-90 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-lg whitespace-nowrap"
                >
                  + Generate New Kundli
                </button>
              </div>

              {/* Grid of Saved Kundlis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {kundliData.map((kundli, index) => (
                  <div key={kundli._id || index} className="bg-[#0d0722] border border-purple-900/40 hover:border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-xl transition-all">
                    <div className="flex items-center justify-between pb-3 border-b border-purple-900/30">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-700/40 flex items-center justify-center text-amber-300 font-serif">
                          ✦
                        </div>
                        <div>
                          <h4 className="text-sm font-serif font-bold text-white">{kundli.name}</h4>
                          <p className="text-[10px] text-purple-300/50">Rashi: {kundli.rashi} • Nakshatra: {kundli.nakshatra}</p>
                        </div>
                      </div>
                      <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full font-semibold">
                        {kundli.status}
                      </span>
                    </div>

                    <div className="bg-[#130b2c]/80 border border-purple-900/40 rounded-xl p-4 space-y-2.5">
                      <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <FiShield className="text-amber-400" /> Recommended Remedies:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-purple-950/50 p-2 rounded-lg border border-purple-900/30">
                          <span className="text-[10px] text-purple-300/50 block">Gemstone</span>
                          <span className="text-white font-medium">{kundli.gemstone}</span>
                        </div>
                        <div className="bg-purple-950/50 p-2 rounded-lg border border-purple-900/30">
                          <span className="text-[10px] text-purple-300/50 block">Rudraksha</span>
                          <span className="text-white font-medium">{kundli.rudraksha}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        onClick={() => showToast(`Viewing full report for ${kundli.name}`)}
                        className="px-4 py-2 bg-purple-900/40 hover:bg-purple-900/70 border border-purple-700/40 text-amber-300 text-xs rounded-xl transition-all cursor-pointer font-medium"
                      >
                        View Full Kundli Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-7 space-y-6">
                
                <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-6 space-y-5 shadow-xl">
                  <div className="flex items-center gap-2 pb-2 border-b border-purple-900/30">
                    <FiUser className="text-amber-400" />
                    <h3 className="font-serif font-bold text-white text-base">Personal Information</h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between py-2 border-b border-purple-900/20">
                      <div>
                        <p className="text-purple-300/50 text-[10px]">Full Name</p>
                        <p className="text-white font-medium text-sm mt-0.5">{user?.name || "Ananya Sharma"}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setEditField("name");
                          setEditValue(user?.name || "");
                          setIsEditing(true);
                        }} 
                        className="p-2 text-purple-300/60 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <FiEdit2 />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-purple-900/20">
                      <div>
                        <p className="text-purple-300/50 text-[10px]">Email Address</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-white font-medium text-sm">{user?.email || "ananya.sharma@email.com"}</p>
                          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                            <FiCheckCircle /> Verified
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setEditField("email");
                          setEditValue(user?.email || "");
                          setIsEditing(true);
                        }} 
                        className="p-2 text-purple-300/60 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <FiEdit2 />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-purple-900/20">
                      <div>
                        <p className="text-purple-300/50 text-[10px]">Phone Number</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-white font-medium text-sm">{user?.phone || "+91 98765 43210"}</p>
                          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                            <FiCheckCircle /> Verified
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setEditField("phone");
                          setEditValue(user?.phone || "");
                          setIsEditing(true);
                        }} 
                        className="p-2 text-purple-300/60 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <FiEdit2 />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-purple-900/20">
                      <div>
                        <p className="text-purple-300/50 text-[10px]">Date of Birth</p>
                        <p className="text-white font-medium text-sm mt-0.5">{user?.dob || "12 March 1998"}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setEditField("dob");
                          setEditValue(user?.dob || "");
                          setIsEditing(true);
                        }} 
                        className="p-2 text-purple-300/60 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <FiEdit2 />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-purple-900/20">
                      <div>
                        <p className="text-purple-300/50 text-[10px]">Gender</p>
                        <p className="text-white font-medium text-sm mt-0.5">{user?.gender || "Female"}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setEditField("gender");
                          setEditValue(user?.gender || "");
                          setIsEditing(true);
                        }} 
                        className="p-2 text-purple-300/60 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <FiEdit2 />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-purple-300/50 text-[10px]">Occupation</p>
                        <p className="text-white font-medium text-sm mt-0.5">{user?.occupation || "Marketing Professional"}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setEditField("occupation");
                          setEditValue(user?.occupation || "");
                          setIsEditing(true);
                        }} 
                        className="p-2 text-purple-300/60 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <FiEdit2 />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-6 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-amber-400" />
                      <h3 className="font-serif font-bold text-white text-base">About Me</h3>
                    </div>
                    <button 
                      onClick={() => {
                        setEditField("bio");
                        setEditValue(user?.bio || "");
                        setIsEditing(true);
                      }} 
                      className="text-purple-300/60 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <FiEdit2 className="text-xs" />
                    </button>
                  </div>
                  <p className="text-xs text-purple-200/70 leading-relaxed">
                    {user?.bio || "I'm passionate about self-growth, learning new skills, and exploring technology."}
                  </p>
                </div>

              </div>

              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-900/30">
                    <div className="flex items-center gap-2">
                      <FiCreditCard className="text-amber-400" />
                      <h3 className="font-serif font-bold text-white text-base">Recent Transactions</h3>
                    </div>
                    <button onClick={() => showToast("Viewing all transactions")} className="text-xs text-amber-400 hover:underline font-medium cursor-pointer">
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.length > 0 ? (
                      orders.slice(0, 4).map((order, idx) => (
                        <div
                          key={order._id || idx}
                          className="flex items-center justify-between p-3 bg-[#130b2c]/60 border border-purple-900/30 hover:border-amber-500/40 rounded-xl transition-all cursor-pointer group"
                          onClick={() => showToast(`Order ID: ${order._id}`)}
                        >
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                              Order #{order._id ? order._id.slice(-6) : idx + 1}
                            </h4>
                            <p className="text-[10px] text-purple-300/50 mt-0.5">
                              {new Date(order.createdAt || Date.now()).toLocaleDateString()} • ₹{order.transactionPrice || order.amount || 0}
                            </p>
                          </div>
                          <span className="bg-purple-950 border border-purple-800/40 text-amber-300 text-[10px] px-2.5 py-1 rounded-lg font-medium">
                            {order.status || "Completed"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-purple-300/50 text-center py-4">No recent transactions found.</p>
                    )}
                  </div>
                </div>

                <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-900/30">
                    <div className="flex items-center gap-2">
                      <FiSliders className="text-amber-400" />
                      <h3 className="font-serif font-bold text-white text-base">Preferences</h3>
                    </div>
                    <button onClick={() => showToast("Preferences updated")} className="text-xs text-amber-400 hover:underline font-medium cursor-pointer">
                      Edit
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-200/80">Language</span>
                      <span className="text-white font-semibold">English</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-purple-200/80">Notification Email</span>
                      <button
                        onClick={() => setNotifs({ ...notifs, email: !notifs.email })}
                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          notifs.email ? "bg-purple-600 justify-end" : "bg-purple-950 justify-start"
                        }`}
                      >
                        <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-purple-200/80">SMS Notifications</span>
                      <button
                        onClick={() => setNotifs({ ...notifs, sms: !notifs.sms })}
                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          notifs.sms ? "bg-purple-600 justify-end" : "bg-purple-950 justify-start"
                        }`}
                      >
                        <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-purple-200/80">Marketing Emails</span>
                      <button
                        onClick={() => setNotifs({ ...notifs, marketing: !notifs.marketing })}
                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          notifs.marketing ? "bg-purple-600 justify-end" : "bg-purple-950 justify-start"
                        }`}
                      >
                        <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}