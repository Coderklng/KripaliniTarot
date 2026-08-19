"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import {
  FiLayout,
  FiCalendar,
  FiBookOpen,
  FiUsers,
  FiCompass,
  FiCreditCard,
  FiStar,
  FiMessageSquare,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiSearch,
  FiBell,
  FiMoreHorizontal,
  FiUserPlus,
  FiArrowRight,
  FiX,
  FiCheckCircle,
  FiClock,
  FiFilter,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function KripaliniDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW DYNAMIC STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | PAID | PENDING
  const [selectedOrder, setSelectedOrder] = useState(null); // Modal State
  const [activeTab, setActiveTab] = useState("Dashboard");

  // FETCH ORDERS
  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = Cookies.get("admin");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/orders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // --- DERIVED METRICS ---
  const paidOrders = useMemo(() => orders.filter((o) => o.isPaid), [orders]);
  const pendingOrders = useMemo(() => orders.filter((o) => !o.isPaid), [orders]);

  const totalEarnings = useMemo(
    () => paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    [paidOrders]
  );
  
  const totalBookings = paidOrders.length;
  const pendingCount = pendingOrders.length;

  // Filtered orders list based on search and tab filter
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const planName = order.serviceDetails?.planName?.toLowerCase() || "";
      const orderId = order._id?.toLowerCase() || "";
      const matchesSearch =
        planName.includes(searchTerm.toLowerCase()) ||
        orderId.includes(searchTerm.toLowerCase());

      if (statusFilter === "PAID") return matchesSearch && order.isPaid;
      if (statusFilter === "PENDING") return matchesSearch && !order.isPaid;
      return matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  // Dynamic Service Popularity Analytics
  const serviceCounts = useMemo(() => {
    return paidOrders.reduce((acc, o) => {
      const name = o.serviceDetails?.planName || "General Reading";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});
  }, [paidOrders]);

  // Dynamic Chart Bar Calculation (Last 5 Active Dynamic Records)
  const chartData = useMemo(() => {
    if (orders.length === 0) return [];
    const maxAmount = Math.max(...orders.map((o) => o.totalAmount || 1));
    return orders.slice(-5).map((o) => ({
      label: new Date(o.createdAt || Date.now()).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      height: `${Math.max(15, Math.round(((o.totalAmount || 0) / maxAmount) * 100))}%`,
      amount: o.totalAmount || 0,
      isPaid: o.isPaid,
    }));
  }, [orders]);


  const logoutUser = () => {
    Cookies.remove("admin");
    setTimeout(() => {
      location.href = "/login";
    }, 1000);
  };



  return (
    <div className="flex min-h-screen bg-[#0a0714] text-zinc-100 font-sans selection:bg-purple-500 selection:text-white relative">
      
      {/* ==================== 1. SIDEBAR ==================== */}
      <aside className="w-64 bg-[#0e091d] border-r border-purple-900/20 p-5 flex flex-col justify-between hidden lg:flex shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-serif">
              ✦
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-amber-200 tracking-wider uppercase leading-none">
                Kripalini
              </h1>
              <span className="text-[10px] text-purple-300/60 tracking-widest uppercase">
                Tarot Reader
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-purple-950/40 to-purple-900/20 border border-purple-800/30 rounded-2xl p-4 text-center relative overflow-hidden">
          <p className="text-amber-200 font-serif text-sm font-medium mb-1">
            Let Cards Guide You
          </p>
          <p className="text-purple-300/60 text-xs mb-3">Trust inner magic.</p>
          <button onClick={logoutUser} className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 text-white text-xs font-semibold py-2 rounded-xl border border-purple-400/20 flex items-center justify-center gap-1.5 shadow-lg shadow-purple-950/50 hover:brightness-110 transition-all cursor-pointer">
            <HiSparkles className="text-amber-300 text-sm" /> Logout
          </button>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-white flex items-center gap-2">
              Welcome back, <span className="text-amber-300 font-normal">Kripalini</span> ✨
            </h1>
            <p className="text-purple-300/60 text-xs mt-1">
              Live Overview • {orders.length} Total Orders Registered
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Real Search Input */}
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/40 text-sm" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search plan or order ID..."
                className="w-full bg-[#130d28] border border-purple-900/30 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder-purple-300/30 focus:outline-none focus:border-amber-500/50 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/60 hover:text-white"
                >
                  <FiX className="text-xs" />
                </button>
              )}
            </div>

            <button className="relative bg-[#130d28] border border-purple-900/30 p-2.5 rounded-full text-purple-300/80 hover:text-white transition-all shrink-0">
              <FiBell className="text-sm" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={`₹${totalEarnings.toLocaleString()}`}
            growth="Live"
            period="Paid Orders"
          />
          <StatCard
            title="Confirmed Bookings"
            value={totalBookings.toString()}
            growth="Active"
            period="Completed Transactions"
          />
          <StatCard
            title="Pending Checkouts"
            value={pendingCount.toString()}
            growth="Unpaid"
            period="Requires Action"
          />
          <StatCard
            title="Total Orders"
            value={orders.length.toString()}
            growth="All Time"
            period="Generated Records"
          />
        </div>

        {/* MIDDLE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* RECENT ORDERS LIST (7 COLS) */}
          <div className="lg:col-span-7 bg-[#110b24] border border-purple-900/30 rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-amber-400 text-sm" />
                <h3 className="font-serif font-medium text-white text-sm">Recent Orders</h3>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#181032] p-1 rounded-xl border border-purple-900/30 self-start sm:self-auto">
                {["ALL", "PAID", "PENDING"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      statusFilter === filter
                        ? "bg-purple-800 text-amber-200 border border-purple-500/40"
                        : "text-purple-300/50 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-3 min-h-[200px]">
              {loading ? (
                <p className="text-xs text-purple-300/50 py-8 text-center">Loading orders...</p>
              ) : filteredOrders.length === 0 ? (
                <p className="text-xs text-purple-300/50 py-8 text-center">No matching orders found.</p>
              ) : (
                filteredOrders.slice(0, 5).map((order) => (
                  <AppointmentItem
                    key={order._id}
                    order={order}
                    onClick={() => setSelectedOrder(order)}
                  />
                ))
              )}
            </div>
          </div>

          {/* DYNAMIC CHART (5 COLS) */}
          <div className="lg:col-span-5 bg-[#110b24] border border-purple-900/30 rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-serif font-medium text-white text-sm">Revenue Flow</h3>
              <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Recent 5 Records
              </span>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <p className="text-2xl font-serif font-bold text-white">₹{totalEarnings.toLocaleString()}</p>
                  <p className="text-[11px] text-purple-300/50">Total Realized Revenue</p>
                </div>
              </div>

              {/* Dynamic Bar Display */}
              <div className="h-40 w-full bg-gradient-to-t from-purple-950/30 to-transparent rounded-xl border border-purple-900/20 relative flex items-end justify-between px-4 pb-2 pt-6">
                {chartData.length === 0 ? (
                  <div className="w-full text-center text-xs text-purple-300/40 my-auto">
                    No Order Data to Plot
                  </div>
                ) : (
                  chartData.map((item, idx) => (
                    <ChartBar
                      key={idx}
                      label={item.label}
                      height={item.height}
                      active={item.isPaid}
                      amount={`₹${item.amount}`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Dynamic Service Popularity */}
          <div className="bg-[#110b24] border border-purple-900/30 rounded-2xl p-5">
            <h3 className="font-serif font-medium text-white text-sm mb-4">Service Popularity</h3>
            <div className="space-y-4">
              {Object.keys(serviceCounts).length === 0 ? (
                <p className="text-xs text-purple-300/50">No paid services recorded.</p>
              ) : (
                Object.entries(serviceCounts).map(([planName, count], idx) => {
                  const pct = Math.round((count / (totalBookings || 1)) * 100);
                  const colors = ["bg-amber-400", "bg-purple-400", "bg-indigo-400"];
                  return (
                    <ServiceProgress
                      key={planName}
                      label={planName}
                      count={`${count} Sales`}
                      percent={`${pct}%`}
                      color={colors[idx % colors.length]}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#110b24] border border-purple-900/30 rounded-2xl p-5 md:col-span-2">
            <h3 className="font-serif font-medium text-white text-sm mb-4">
              Quick Management <span className="text-amber-300">Actions</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ActionButton
                icon={<FiCalendar className="text-amber-400" />}
                label="Book Session"
                onClick={() => location.href="/reading"}
              />
              <ActionButton
                icon={<FiUserPlus className="text-purple-400" />}
                label="Add Client"
                onClick={() => alert("Client Registration Modal Ready")}
              />
              <ActionButton
                icon={<FiCreditCard className="text-indigo-400" />}
                label="Sync Payments"
                onClick={() => location.href="/pricing"}
              />
              <ActionButton
                icon={<FiMessageSquare className="text-pink-400" />}
                label="Send SMS"
                onClick={() => location.href="/message"}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ==================== ORDER DETAILS & KUNDLI TEXT MODAL ==================== */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120a2a] border border-purple-800/50 rounded-2xl p-6 max-w-lg w-full relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-purple-300/60 hover:text-white cursor-pointer"
            >
              <FiX className="text-lg" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-900/50 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
                ✦
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-base">
                  {selectedOrder.serviceDetails?.planName || "Tarot Reading / Kundli"}
                </h3>
                <p className="text-xs text-purple-300/50">ID: {selectedOrder._id}</p>
              </div>
            </div>

            <hr className="border-purple-900/40" />

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-purple-900/20">
                <span className="text-purple-300/60">Amount Paid</span>
                <span className="text-amber-300 font-bold">₹{selectedOrder.totalAmount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-900/20">
                <span className="text-purple-300/60">Payment Status</span>
                <span
                  className={`font-semibold ${
                    selectedOrder.isPaid ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {selectedOrder.isPaid ? "Completed (Paid)" : "Pending Payment"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-900/20">
                <span className="text-purple-300/60">Created At</span>
                <span className="text-zinc-200">
                  {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </span>
              </div>

              {/* 📜 Extracted Kundli Text / Data Section for Sister */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-purple-200 font-semibold flex items-center gap-1.5">
                    <span>📜</span> Extracted Kundli Data / Text:
                  </span>
                  {selectedOrder.fileUrl && (
                    <a
                      href={selectedOrder.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:underline text-[11px]"
                    >
                      View Original PDF ↗
                    </a>
                  )}
                </div>

                <div className="bg-black/50 border border-purple-900/40 p-3 rounded-xl max-h-48 overflow-y-auto font-mono text-[11px] text-purple-200 whitespace-pre-wrap">
                  {selectedOrder.extractedKundliText || "No text extracted or file available for this order yet."}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full bg-purple-900/60 hover:bg-purple-800 border border-purple-500/30 text-white text-xs py-2.5 rounded-xl font-semibold transition-all mt-4 cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== HELPER MINI COMPONENTS ==================== */

function StatCard({ title, value, growth, period }) {
  return (
    <div className="bg-[#110b24] border border-purple-900/30 rounded-2xl p-4 flex flex-col justify-between">
      <span className="text-xs text-purple-300/60 font-medium">{title}</span>
      <div className="my-2">
        <h2 className="text-2xl font-serif font-bold text-white">{value}</h2>
      </div>
      <div className="flex items-center gap-1.5 text-[11px]">
        <span className="text-emerald-400 font-semibold">{growth}</span>
        <span className="text-purple-300/40">{period}</span>
      </div>
    </div>
  );
}

function AppointmentItem({ order, onClick }) {
  const name = order.serviceDetails?.planName || "Tarot Reading";
  const status = order.isPaid ? "Paid" : "Pending";
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-2.5 bg-[#170e30]/50 border border-purple-900/20 rounded-xl hover:border-purple-600/50 cursor-pointer transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-purple-900/40 border border-amber-400/30 flex items-center justify-center text-amber-300 text-xs font-bold group-hover:scale-105 transition-transform">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-xs font-semibold text-white group-hover:text-amber-200 transition-colors">
            {name}
          </p>
          <p className="text-[10px] text-purple-300/50">ID: ...{order._id?.slice(-6)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-semibold text-amber-300">₹{order.totalAmount}</p>
          <p className="text-[10px] text-purple-300/40">{date}</p>
        </div>
        <span
          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
            status === "Paid"
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : "text-amber-400 bg-amber-500/10 border-amber-500/20"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function ChartBar({ label, height, active, amount }) {
  return (
    <div className="flex flex-col items-center gap-1 z-10 w-8 group relative">
      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-950 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-purple-500/40 pointer-events-none whitespace-nowrap">
        {amount}
      </div>
      <div className="w-full flex justify-center items-end h-28">
        <div
          style={{ height }}
          className={`w-2.5 rounded-full transition-all ${
            active
              ? "bg-gradient-to-t from-amber-500 to-amber-300 shadow-lg shadow-amber-500/30"
              : "bg-purple-800/40 hover:bg-purple-700/60"
          }`}
        ></div>
      </div>
      <span className="text-[9px] text-purple-300/50 font-medium">{label}</span>
    </div>
  );
}

function ServiceProgress({ label, count, percent, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white font-medium">{label}</span>
        <span className="text-purple-300/50 text-[11px]">
          {percent} ({count})
        </span>
      </div>
      <div className="w-full h-1.5 bg-purple-950 rounded-full overflow-hidden">
        <div style={{ width: percent }} className={`h-full ${color} rounded-full`}></div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3 bg-[#170e30]/60 border border-purple-900/30 hover:border-amber-500/40 rounded-xl transition-all group active:scale-95 cursor-pointer"
    >
      <span className="text-lg mb-1 group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-[11px] font-medium text-purple-200/80 text-center">{label}</span>
    </button>
  );
}