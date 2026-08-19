'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  CreditCard,
  Send,
  MessageSquare,
  Star,
  FileText,
  BarChart3,
  Settings,
  User,
  Search,
  ChevronDown,
  Clock,
  RotateCcw,
  CheckCircle2,
  X,
  Sparkles,
  Wallet,
  Loader2,
  RefreshCw,
  Eye
} from 'lucide-react';

export default function PaymentsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('Payments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedMethod, setSelectedMethod] = useState('All Payment Methods');
  
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Helper to extract JWT token cleanly
  const getToken = () => {
    if (typeof window === 'undefined') return null;
    const adminData = localStorage.getItem('admin') || localStorage.getItem('token');
    if (!adminData) return null;

    try {
      const parsed = JSON.parse(adminData);
      return parsed.token || parsed.jwt || parsed.accessToken || adminData;
    } catch (e) {
      return adminData;
    }
  };

  // FETCH ORDERS
  const fetchOrders = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const response = await fetch('https://path-stroke-substances-radar.trycloudflare.com/api/orders/myorders', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders (${response.status})`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Error loading orders');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // 🚀 REAL-TIME AUTO POLLING: Har 10 Seconds me automatic API call karega
  useEffect(() => {
    fetchOrders(true); // Pehli baar loader ke sath fetch karega

    const interval = setInterval(() => {
      fetchOrders(false); // Background me silent sync
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Metrics Calculation
  const metrics = useMemo(() => {
    const totalAmount = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const successful = orders.filter((o) => o.isPaid || o.orderStatus === 'delivered' || o.orderStatus === 'processing').length;
    const pending = orders.filter((o) => !o.isPaid && o.orderStatus === 'pending').length;
    const refunds = orders.filter((o) => o.orderStatus === 'refunded' || o.orderStatus === 'cancelled').length;
    const aov = orders.length > 0 ? Math.round(totalAmount / orders.length) : 0;

    return { totalAmount, successful, pending, refunds, aov };
  }, [orders]);

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const clientName = order.user?.name || 'Guest User';
      const clientEmail = order.user?.email || '';

      const matchesSearch =
        clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order._id && order._id.includes(searchQuery));

      const matchesStatus =
        selectedStatus === 'All Status' ||
        (order.orderStatus && order.orderStatus.toLowerCase() === selectedStatus.toLowerCase());

      const matchesMethod =
        selectedMethod === 'All Payment Methods' ||
        (order.paymentMethod && order.paymentMethod.toLowerCase().includes(selectedMethod.toLowerCase()));

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [orders, searchQuery, selectedStatus, selectedMethod]);

  return (
    <div className="flex min-h-screen bg-[#0A0914] text-gray-200 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0F0D1C] border-r border-[#1E1B33] flex flex-col justify-between p-4 sticky top-0 h-screen hidden lg:flex">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-600/30 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold text-amber-200 tracking-wide">Kripalini</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Tarot Reader</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Appointments', icon: Calendar },
              { name: 'Readings', icon: BookOpen },
              { name: 'Clients', icon: Users },
              { name: 'Payments', icon: CreditCard },
              { name: 'Send SMS', icon: Send },
              { name: 'Messages', icon: MessageSquare },
              { name: 'Reviews & Testimonials', icon: Star },
              { name: 'Blog Management', icon: FileText },
              { name: 'Analytics', icon: BarChart3 },
              { name: 'Settings', icon: Settings },
              { name: 'Profile', icon: User },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-900/40 to-purple-800/10 border border-purple-500/30 text-amber-300 font-medium shadow-lg'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#18152B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                    <span>{item.name}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-white flex items-center gap-2">
              Payments & Live Orders <Sparkles className="w-5 h-5 text-amber-400" />
            </h1>
            <p className="text-xs text-gray-400 mt-1">Live order updates synced with Gateway Payments (Auto-Refreshing).</p>
          </div>

          <button
            onClick={() => fetchOrders(true)}
            className="p-2.5 bg-[#151226] border border-[#272340] hover:border-purple-500/50 rounded-xl text-gray-300 transition flex items-center gap-2 text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            Refresh Now
          </button>
        </header>

        {/* SEARCH & FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client name, email or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131024] border border-[#231F3B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="sm:col-span-3 relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#131024] border border-[#231F3B] rounded-xl px-3 py-2.5 text-xs text-gray-300 appearance-none focus:outline-none focus:border-purple-500"
            >
              <option value="All Status">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing (Paid)</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="sm:col-span-3 relative">
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full bg-[#131024] border border-[#231F3B] rounded-xl px-3 py-2.5 text-xs text-gray-300 appearance-none focus:outline-none focus:border-purple-500"
            >
              <option value="All Payment Methods">All Payment Methods</option>
              <option value="razorpay">Razorpay</option>
              <option value="stripe">Stripe</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#131024] border border-[#231F3B] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#231F3B]">
            <h2 className="text-sm font-semibold text-white">Live Mongo Orders ({filteredOrders.length})</h2>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              <p className="text-xs">Fetching orders from Express Backend...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-rose-400 text-xs">⚠️ {error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-[#231F3B]/60 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-2">Order ID</th>
                    <th className="py-3 px-2">Client Details</th>
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Gateway</th>
                    <th className="py-3 px-2">Payment Status</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#231F3B]/50">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-[#1C1833]/50 transition">
                        <td className="py-4 px-2 text-purple-400 font-mono text-[11px]">
                          #{order._id ? order._id.substring(order._id.length - 6) : 'N/A'}
                        </td>

                        <td className="py-4 px-2">
                          <div>
                            <p className="font-medium text-gray-100">{order.user?.name || 'Guest Customer'}</p>
                            <p className="text-[11px] text-gray-400">{order.user?.email || 'N/A'}</p>
                          </div>
                        </td>

                        <td className="py-4 px-2 font-semibold text-amber-300 text-sm">
                          ₹{order.totalAmount ? order.totalAmount.toLocaleString() : 0}
                        </td>

                        <td className="py-4 px-2 text-gray-300 font-medium uppercase">
                          {order.paymentMethod || 'Razorpay'}
                        </td>

                        {/* LIVE AUTO STATUS BADGE (NO DROPDOWN) */}
                        <td className="py-4 px-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                              order.isPaid || order.orderStatus === 'processing' || order.orderStatus === 'delivered'
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50'
                                : order.orderStatus === 'cancelled'
                                ? 'bg-rose-950/80 text-rose-400 border-rose-800/50'
                                : 'bg-amber-950/80 text-amber-400 border-amber-800/50'
                            }`}
                          >
                            {order.isPaid || order.orderStatus === 'processing'
                              ? '✅ Paid / Successful'
                              : order.orderStatus === 'delivered'
                              ? '📦 Delivered'
                              : order.orderStatus === 'cancelled'
                              ? '❌ Cancelled'
                              : '⏳ Pending Payment'}
                          </span>
                        </td>

                        <td className="py-4 px-2 text-gray-400 text-[11px]">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                        </td>

                        <td className="py-4 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 rounded-xl border border-[#2E284C] hover:border-purple-500 bg-[#1A1633] hover:bg-[#252046] text-gray-200 transition text-[11px] inline-flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-purple-400" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* VIEW ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#131024] border border-[#2D284D] rounded-2xl w-full max-w-lg p-6 relative shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#231F3B]">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  Transaction & Order Details <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <p className="text-xs text-purple-400 font-mono">ID: #{selectedOrder._id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white p-1.5 rounded-xl bg-[#1D1936] border border-[#29244A] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs bg-[#1A1633] p-4 rounded-xl border border-[#282348] mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Customer:</span>
                <span className="text-gray-100 font-medium">{selectedOrder.user?.name || 'Guest User'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-gray-200">{selectedOrder.user?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gateway:</span>
                <span className="text-gray-200 uppercase font-semibold">{selectedOrder.paymentMethod || 'Razorpay'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment ID:</span>
                <span className="text-purple-300 font-mono">{selectedOrder.paymentResult?.id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Status:</span>
                <span className={selectedOrder.isPaid ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {selectedOrder.isPaid ? 'PAID' : 'PENDING'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#282348]">
                <span className="text-gray-300 font-semibold">Total Paid:</span>
                <span className="text-amber-300 font-bold text-sm">₹{selectedOrder.totalAmount?.toLocaleString() || 0}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-700 text-white font-medium text-xs rounded-xl transition shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}