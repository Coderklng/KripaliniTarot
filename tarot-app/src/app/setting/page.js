"use client";

import { useState } from "react";
import {
  FiLayout,
  FiCalendar,
  FiCompass,
  FiBookOpen,
  FiUsers,
  FiCreditCard,
  FiStar,
  FiMessageSquare,
  FiSend,
  FiEdit,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiSearch,
  FiBell,
  FiLock,
  FiGlobe,
  FiClock,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiChevronRight,
  FiTrash2,
  FiHeadphones,
  FiShield,
  FiSliders,
  FiSave,
  FiCamera,
  FiCheck,
  FiChevronDown,
  FiX
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Settings");
  const [activeSettingTab, setActiveSettingTab] = useState("General");

  // Form State initialized with reference values
  const [formData, setFormData] = useState({
    siteTitle: "Kripalini Tarot Reader",
    timezone: "(GMT+05:30) Asia/Kolkata",
    tagline: "Guiding souls with intuition and timeless wisdom.",
    language: "English",
    phone: "+91 98765 43210",
    email: "kripalini.tarot@gmail.com",
    website: "https://kripalinitarot.com",
    businessName: "Kripalini Tarot Reader",
    experience: "5+ Years",
    specialization: "Love, Career, Finance, Spiritual Guidance",
    workingFrom: "10:00 AM",
    workingTo: "08:00 PM",
  });

  const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Modal States
  const [modalType, setModalType] = useState(null); // 'password' | 'emailPref' | 'sms' | '2fa' | 'delete' | null
  const [toastMessage, setToastMessage] = useState("");

  // Password Form State
  const [passData, setPassData] = useState({ current: "", newPass: "", confirm: "" });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast("Settings updated and saved successfully! ✨");
  };

  return (
    <div className="min-h-screen bg-[#070314] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black flex flex-col relative">
      
      {/* ==================== TOAST NOTIFICATION ==================== */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-purple-900 to-indigo-900 border border-amber-500/50 text-amber-300 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <HiSparkles className="text-amber-400 text-sm" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==================== TOP NAVBAR ==================== */}
      <header className="bg-[#0b051e]/80 backdrop-blur-md border-b border-purple-900/30 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            Settings <HiSparkles className="text-amber-400 text-sm" />
          </h1>
          <p className="text-xs text-purple-300/50 hidden md:block border-l border-purple-900/40 pl-3">
            Manage your account, preferences and website settings.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/40 text-xs" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-[#130b2c] border border-purple-900/40 rounded-full py-1.5 pl-8 pr-3 text-xs text-white placeholder-purple-300/30 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <button className="relative p-2 text-purple-300/80 hover:text-white transition-colors cursor-pointer" onClick={() => showToast("You have 3 unread notifications.")}>
            <FiBell className="text-base" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-purple-600 border border-[#070314] text-[9px] font-bold text-white rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-purple-900/40">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5">
              <div className="w-full h-full bg-[#0c0621] rounded-full flex items-center justify-center text-amber-300 font-bold text-xs">
                {formData.siteTitle.charAt(0)}
              </div>
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <p className="text-xs font-semibold text-white">{formData.businessName}</p>
              <p className="text-[10px] text-purple-300/50">Tarot Reader</p>
            </div>
            <FiChevronDown className="text-xs text-purple-300/40 hidden lg:block" />
          </div>
        </div>
      </header>

      {/* ==================== MAIN BODY ==================== */}
      <div className="flex flex-1">
        
        {/* ==================== LEFT SIDEBAR ==================== */}
        <aside className="w-60 bg-[#0a041b] border-r border-purple-900/20 p-4 flex flex-col justify-between hidden lg:flex shrink-0">
          <div>
            {/* Brand Header */}
            <div className="flex items-center gap-3 px-2 mb-6">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-serif text-lg">
                ✦
              </div>
              <div>
                <h2 className="font-serif text-sm font-bold text-amber-200 tracking-wider uppercase leading-none">
                  Kripalini
                </h2>
                <span className="text-[9px] text-purple-300/60 tracking-widest uppercase">
                  Tarot Reader
                </span>
              </div>
            </div>

            <nav className="space-y-1 text-xs font-medium">
              {[
                { icon: <FiLayout />, label: "Dashboard" },
                { icon: <FiCalendar />, label: "Appointments" },
                { icon: <FiCompass />, label: "Readings" },
                { icon: <FiBookOpen />, label: "My Readings" },
                { icon: <FiUsers />, label: "Clients" },
                { icon: <FiCreditCard />, label: "Payments" },
                { icon: <FiStar />, label: "Reviews & Testimonials" },
                { icon: <FiMessageSquare />, label: "Messages", badge: "5" },
                { icon: <FiSend />, label: "Send SMS" },
                { icon: <FiEdit />, label: "Blog Management" },
                { icon: <FiBarChart2 />, label: "Analytics" },
                { icon: <FiSettings />, label: "Settings" },
                { icon: <FiUser />, label: "Profile" },
              ].map((item) => (
                <div
                  key={item.label}
                  onClick={() => {
                    setActiveTab(item.label);
                    if(item.label !== "Settings") showToast(`Switched to ${item.label} view`);
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    activeTab === item.label
                      ? "bg-purple-900/50 border border-purple-500/30 text-amber-300 font-semibold shadow-md shadow-purple-950/50"
                      : "text-purple-200/60 hover:text-white hover:bg-purple-900/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-purple-800 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom Upgrade Card */}
          <div className="bg-gradient-to-b from-purple-950/40 via-purple-900/20 to-transparent border border-purple-800/30 rounded-2xl p-4 text-center relative overflow-hidden mt-6">
            <h4 className="text-xs font-bold text-white mb-2">Unlock Premium Experience</h4>
            <ul className="text-[10px] text-purple-300/70 space-y-1 text-left mb-4 list-disc list-inside">
              <li>Priority Support</li>
              <li>Advanced Analytics</li>
              <li>Custom Templates</li>
            </ul>
            <button onClick={() => showToast("Upgraded to Pro Plan successfully! 🎉")} className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/40 text-amber-300 font-medium text-xs py-2 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer">
              Upgrade Now <HiSparkles />
            </button>
          </div>
        </aside>

        {/* ==================== RIGHT CONTENT ==================== */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto">
          
          {/* HORIZONTAL SETTINGS TABS */}
          <div className="flex items-center gap-2 border-b border-purple-900/30 overflow-x-auto pb-1 text-xs font-medium">
            {[
              { id: "General", label: "General", icon: <FiSliders /> },
              { id: "Profile", label: "Profile", icon: <FiUser /> },
              { id: "Notifications", label: "Notifications", icon: <FiBell /> },
              { id: "Privacy", label: "Privacy & Security", icon: <FiLock /> },
              { id: "Payment", label: "Payment Settings", icon: <FiCreditCard /> },
              { id: "Integrations", label: "Integrations", icon: <FiGlobe /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSettingTab(tab.id);
                  showToast(`Loaded ${tab.label} section`);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeSettingTab === tab.id
                    ? "border-amber-400 text-amber-300 bg-purple-950/40 font-semibold"
                    : "border-transparent text-purple-300/60 hover:text-white hover:bg-purple-900/20"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* MAIN GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT FORM SECTION (8 COLS) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* CARD 1: GENERAL SETTINGS */}
              <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-6 space-y-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/40 text-amber-300 text-base">
                    <FiSliders />
                  </div>
                  <h3 className="font-serif font-bold text-white text-base">General Settings</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-200/80">Site Title</label>
                    <input
                      type="text"
                      name="siteTitle"
                      value={formData.siteTitle}
                      onChange={handleInputChange}
                      className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-200/80">Timezone</label>
                    <div className="relative">
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/60 appearance-none cursor-pointer"
                      >
                        <option>(GMT+05:30) Asia/Kolkata</option>
                        <option>(GMT+00:00) UTC</option>
                        <option>(GMT-05:00) Eastern Time</option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/40 text-xs pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-200/80">Tagline</label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleInputChange}
                      className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-200/80">Language</label>
                    <div className="relative">
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/60 appearance-none cursor-pointer"
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/40 text-xs pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: CONTACT INFORMATION */}
              <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-6 space-y-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/40 text-amber-300 text-base">
                    <FiPhone />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-white text-base">Contact Information</h3>
                    <p className="text-[11px] text-purple-300/50">This information will be visible to your clients.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-200/80">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-200/80">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-200/80">Website</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 3: BUSINESS INFORMATION */}
              <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-6 space-y-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/40 text-amber-300 text-base">
                    <FiBriefcase />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-white text-base">Business Information</h3>
                    <p className="text-[11px] text-purple-300/50">Manage your business details and availability.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-200/80">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-200/80">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-200/80">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                </div>

                {/* Days & Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  
                  {/* Available Days Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-purple-200/80 block">Available Days</label>
                    <div className="flex flex-wrap gap-1.5">
                      {daysList.map((day) => {
                        const isSelected = selectedDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-purple-900/70 border-purple-500/50 text-amber-300 font-bold"
                                : "bg-[#080417] border-purple-900/40 text-purple-300/50 hover:text-white"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-purple-200/80 block">Working Hours</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          name="workingFrom"
                          value={formData.workingFrom}
                          onChange={handleInputChange}
                          className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60"
                        />
                        <FiClock className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/30 text-xs pointer-events-none" />
                      </div>
                      <span className="text-xs text-purple-300/50">To</span>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          name="workingTo"
                          value={formData.workingTo}
                          onChange={handleInputChange}
                          className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60"
                        />
                        <FiClock className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/30 text-xs pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Changes Button */}
                <div className="flex justify-end pt-4 border-t border-purple-900/30">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 hover:brightness-120 text-amber-300 border border-purple-500/40 font-semibold text-xs px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <FiSave className="text-sm" /> Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR WIDGETS (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* ACCOUNT OVERVIEW CARD */}
              <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-6 text-center space-y-4 shadow-xl">
                <h3 className="text-xs font-semibold text-purple-200/80 text-left">Account Overview</h3>
                
                <div className="relative w-20 h-20 mx-auto">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5">
                    <div className="w-full h-full bg-[#080417] rounded-full flex items-center justify-center text-amber-300 font-serif font-bold text-2xl">
                      {formData.siteTitle.charAt(0)}
                    </div>
                  </div>
                  <button onClick={() => showToast("Profile picture upload feature triggered!")} className="absolute bottom-0 right-0 p-1.5 bg-purple-900 border border-purple-500/50 rounded-full text-amber-300 hover:text-white transition-colors cursor-pointer">
                    <FiCamera className="text-xs" />
                  </button>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-white text-base">{formData.businessName}</h4>
                  <p className="text-xs text-purple-300/60">Tarot Reader & Consultant</p>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold px-3 py-1 rounded-full">
                  <HiSparkles /> Premium Member
                </div>

                <p className="text-[10px] text-purple-300/40 border-t border-purple-900/30 pt-3">
                  Member Since May 2023
                </p>
              </div>

              {/* QUICK SETTINGS CARD */}
              <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-xs font-semibold text-purple-200/80">Quick Settings</h3>

                <div className="space-y-3">
                  <div onClick={() => setModalType("password")}>
                    <QuickSettingRow
                      icon={<FiLock />}
                      title="Change Password"
                      desc="Update your account password"
                    />
                  </div>
                  <div onClick={() => setModalType("emailPref")}>
                    <QuickSettingRow
                      icon={<FiMail />}
                      title="Email Preferences"
                      desc="Manage your email notifications"
                    />
                  </div>
                  <div onClick={() => setModalType("sms")}>
                    <QuickSettingRow
                      icon={<FiMessageSquare />}
                      title="SMS Settings"
                      desc="Manage SMS preferences"
                    />
                  </div>
                  <div onClick={() => setModalType("2fa")}>
                    <QuickSettingRow
                      icon={<FiShield />}
                      title="Two-Factor Authentication"
                      desc="Add extra security to your account"
                    />
                  </div>
                  <div onClick={() => setModalType("delete")}>
                    <QuickSettingRow
                      icon={<FiTrash2 className="text-red-400" />}
                      title="Delete Account"
                      desc="Permanently delete your account"
                      isDanger
                    />
                  </div>
                </div>
              </div>

              {/* NEED HELP CARD */}
              <div className="bg-[#0d0722] border border-purple-900/40 rounded-2xl p-6 text-center space-y-3 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-purple-900/40 border border-purple-700/30 flex items-center justify-center text-amber-400 text-xl mx-auto">
                  <FiHeadphones />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Need Help?</h4>
                  <p className="text-[10px] text-purple-300/50 mt-1">
                    If you need help with settings, we're here for you.
                  </p>
                </div>
                <button onClick={() => showToast("Support ticket created! We will contact you soon.")} className="w-full bg-[#130b2c] border border-purple-800/40 hover:border-amber-500/40 text-amber-300 text-xs font-medium py-2 rounded-xl transition-all cursor-pointer">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ==================== INTERACTIVE MODALS ==================== */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0722] border border-purple-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-purple-300/50 hover:text-white cursor-pointer"
            >
              <FiX className="text-base" />
            </button>

            {modalType === "password" && (
              <>
                <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
                  <FiLock className="text-amber-400" /> Change Password
                </h3>
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-purple-200/80">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-purple-200/80">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-purple-200/80">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#080417] border border-purple-900/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60" />
                  </div>
                  <button onClick={() => { setModalType(null); showToast("Password updated successfully!"); }} className="w-full mt-2 bg-gradient-to-r from-purple-900 to-indigo-900 text-amber-300 font-semibold text-xs py-2.5 rounded-xl border border-purple-500/40 cursor-pointer">
                    Update Password
                  </button>
                </div>
              </>
            )}

            {modalType === "emailPref" && (
              <>
                <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
                  <FiMail className="text-amber-400" /> Email Preferences
                </h3>
                <div className="space-y-3 pt-2 text-xs text-purple-200/80">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-purple-600 rounded" /> Receive booking alerts via email
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-purple-600 rounded" /> Receive weekly tarot insights newsletter
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" className="accent-purple-600 rounded" /> Promotional offers and discounts
                  </label>
                  <button onClick={() => { setModalType(null); showToast("Email preferences saved!"); }} className="w-full mt-3 bg-gradient-to-r from-purple-900 to-indigo-900 text-amber-300 font-semibold text-xs py-2.5 rounded-xl border border-purple-500/40 cursor-pointer">
                    Save Preferences
                  </button>
                </div>
              </>
            )}

            {modalType === "sms" && (
              <>
                <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
                  <FiMessageSquare className="text-amber-400" /> SMS Settings
                </h3>
                <div className="space-y-3 pt-2 text-xs text-purple-200/80">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-purple-600 rounded" /> Client appointment reminder SMS
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-purple-600 rounded" /> Instant chat notification SMS
                  </label>
                  <button onClick={() => { setModalType(null); showToast("SMS settings updated!"); }} className="w-full mt-3 bg-gradient-to-r from-purple-900 to-indigo-900 text-amber-300 font-semibold text-xs py-2.5 rounded-xl border border-purple-500/40 cursor-pointer">
                    Save Settings
                  </button>
                </div>
              </>
            )}

            {modalType === "2fa" && (
              <>
                <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
                  <FiShield className="text-amber-400" /> Two-Factor Authentication
                </h3>
                <p className="text-xs text-purple-300/60 leading-relaxed">
                  Protect your tarot reading dashboard with an extra layer of security using Google Authenticator or SMS OTP.
                </p>
                <button onClick={() => { setModalType(null); showToast("2FA successfully enabled!"); }} className="w-full mt-2 bg-gradient-to-r from-purple-900 to-indigo-900 text-amber-300 font-semibold text-xs py-2.5 rounded-xl border border-purple-500/40 cursor-pointer">
                  Enable 2FA Authentication
                </button>
              </>
            )}

            {modalType === "delete" && (
              <>
                <h3 className="font-serif font-bold text-red-400 text-base flex items-center gap-2">
                  <FiTrash2 /> Delete Account
                </h3>
                <p className="text-xs text-purple-300/60 leading-relaxed">
                  Are you sure you want to permanently delete your account? All your client history, readings, and settings will be wiped out.
                </p>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setModalType(null)} className="flex-1 bg-purple-950 text-white text-xs py-2.5 rounded-xl border border-purple-800/50 cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={() => { setModalType(null); showToast("Account deletion request submitted."); }} className="flex-1 bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs py-2.5 rounded-xl cursor-pointer">
                    Yes, Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#050210] border-t border-purple-900/30 py-3 px-6 text-[10px] text-purple-300/40 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 {formData.businessName}. All Rights Reserved.</p>
        <p className="flex items-center gap-1">
          Made with <span className="text-purple-400">💜</span> for divine guidance ✨
        </p>
      </footer>
    </div>
  );
}

/* ==================== HELPER ROW COMPONENT ==================== */

function QuickSettingRow({ icon, title, desc, isDanger = false }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-purple-950/30 transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-purple-950/60 border border-purple-800/30 ${isDanger ? "text-red-400" : "text-amber-400"}`}>
          {icon}
        </div>
        <div>
          <h4 className={`text-xs font-semibold ${isDanger ? "text-red-400" : "text-white"}`}>{title}</h4>
          <p className="text-[10px] text-purple-300/40">{desc}</p>
        </div>
      </div>
      <FiChevronRight className={`text-xs transition-transform group-hover:translate-x-1 ${isDanger ? "text-red-400" : "text-purple-300/40"}`} />
    </div>
  );
}