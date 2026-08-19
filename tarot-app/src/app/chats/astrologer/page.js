'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import Cookies from 'js-cookie';

function AstrologerChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [orderId, setOrderId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [quickNotes, setQuickNotes] = useState('');
  const [currentUserId, setCurrentUserId] = useState('astrologer_kripalini');
  const [chatError, setChatError] = useState(null);
  
  const chatEndRef = useRef(null);
  const timerRef = useRef(null);
  const isMountedRef = useRef(true);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const templates = [
    "✨ Welcome to your Tarot session! Please share your birth details.",
    "🔮 The cards indicate positive energy and upcoming opportunities.",
    "🌙 Take a deep breath. Focus on your question clearly.",
    "⏳ Our session time is about to complete. Do you have any final questions?"
  ];

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Token decoding & Auth check
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn("No auth token found. Redirecting to login...");
      router.push('/astrologer/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.id || payload.userId || payload.sub) {
        if (isMountedRef.current) setCurrentUserId(payload.id || payload.userId || payload.sub);
      }
    } catch (e) {
      console.error("Token parsing error:", e);
    }
  }, [router]);

  // 1. Resolve Order ID & Load Saved Notes
  useEffect(() => {
    const queryOrderId = searchParams.get('orderId');
    const localOrderId = typeof window !== 'undefined' ? localStorage.getItem('orderId') : null;
    
    const activeId = queryOrderId || localOrderId;
    if (activeId) {
      if (isMountedRef.current) setOrderId(activeId);
      const savedNotes = localStorage.getItem(`notes_${activeId}`);
      if (savedNotes && isMountedRef.current) setQuickNotes(savedNotes);
    } else {
      if (isMountedRef.current) setLoading(false);
    }
  }, [searchParams]);

  const handleNotesChange = (val) => {
    setQuickNotes(val);
    if (orderId) {
      localStorage.setItem(`notes_${orderId}`, val);
    }
  };

  // 2. Timer, Server Validation & API Session Init
  useEffect(() => {
    if (!orderId) return;

    const cookieKey = `chat_session_end_${orderId}`;

    const startTimerWithTarget = (endTimeMs) => {
      if (timerRef.current) clearInterval(timerRef.current);

      const updateCountdown = () => {
        const distance = Math.floor((endTimeMs - Date.now()) / 1000);
        if (distance <= 0) {
          clearInterval(timerRef.current);
          if (isMountedRef.current) {
            setTimeLeft(0);
            setIsSessionExpired(true);
            Cookies.remove(cookieKey);
            
            // 🚀 Timer 0 hote hi astrologer ko home page ya dashboard par redirect kar do
            setTimeout(() => {
              router.push('/'); // Ya phir '/astrologer/dashboard'
            }, 2000);
          }
        } else {
          if (isMountedRef.current) {
            setTimeLeft(distance);
          }
        }
      };

      updateCountdown();
      timerRef.current = setInterval(updateCountdown, 1000);
    };

    const savedCookieTime = Cookies.get(cookieKey);
    if (savedCookieTime) {
      const parsedTime = parseInt(savedCookieTime, 10);
      if (parsedTime > Date.now()) {
        startTimerWithTarget(parsedTime);
      } else {
        if (isMountedRef.current) {
          setIsSessionExpired(true);
          router.push('/');
        }
      }
    }

    const initSession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const backendBase = process.env.NEXT_PUBLIC_API_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || '';
        
        // 🔒 Server-side validation to check if session is expired or valid
        const statusRes = await fetch(`${backendBase}/api/orders/${orderId}/status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.status === 'EXPIRED' || (statusData.sessionEndTime && new Date(statusData.sessionEndTime).getTime() <= Date.now())) {
            if (isMountedRef.current) {
              setIsSessionExpired(true);
              setTimeLeft(0);
              Cookies.remove(cookieKey);
              setLoading(false);
              router.push('/');
            }
            return;
          }
        }

        const res = await fetch(`${backendBase}/api/orders/${orderId}/start-chat`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.status === 401) {
          console.error("Unauthorized request (401). Token might be invalid or expired.");
          localStorage.removeItem('token');
          router.push('/astrologer/login');
          return;
        }

        if (res.ok) {
          const data = await res.json();
          const serverEndTime = data.sessionEndTime 
            ? new Date(data.sessionEndTime).getTime() 
            : Date.now() + 15 * 60 * 1000;

          if (serverEndTime <= Date.now()) {
            if (isMountedRef.current) {
              setIsSessionExpired(true);
              setTimeLeft(0);
              router.push('/');
            }
          } else if (isMountedRef.current) {
            Cookies.set(cookieKey, serverEndTime.toString(), { expires: 1 });
            startTimerWithTarget(serverEndTime);
          }
        }

        // Ensure parent Firestore chat document exists
        await setDoc(doc(db, 'chats', orderId), {
          orderId: orderId,
          updatedAt: serverTimestamp()
        }, { merge: true });

      } catch (err) {
        console.error("Session Init Error:", err);
        if (!savedCookieTime && isMountedRef.current) {
          const fallbackEnd = Date.now() + 15 * 60 * 1000;
          Cookies.set(cookieKey, fallbackEnd.toString(), { expires: 1 });
          startTimerWithTarget(fallbackEnd);
        }
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    initSession();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [orderId, router]);

  // 3. Realtime Firebase Listener with Standardized Sorting
  useEffect(() => {
    if (!orderId) {
      if (isMountedRef.current) {
        setMessages([]);
        setLoading(false);
      }
      return;
    }

    let unsubscribe = () => {};
    try {
      const messagesRef = collection(db, 'chats', orderId, 'messages');
      unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        fetched.sort((a, b) => {
          const getTime = (v) => {
            if (!v) return 0;
            if (v.toMillis) return v.toMillis();
            if (v.toDate) return v.toDate().getTime();
            const parsed = new Date(v).getTime();
            return isNaN(parsed) ? 0 : parsed;
          };
          return getTime(a.createdAt) - getTime(b.createdAt);
        });

        if (isMountedRef.current) {
          setMessages(fetched);
          setLoading(false);
        }
      }, (err) => {
        console.error("Astrologer Listener Error:", err);
        if (isMountedRef.current) {
          setChatError("Firebase Sync Error: " + err.message);
          setLoading(false);
        }
      });
    } catch (e) {
      console.error("Firestore init error:", e);
      if (isMountedRef.current) setLoading(false);
    }

    return () => unsubscribe();
  }, [orderId]);

  useEffect(() => { 
    if (messages.length > 0) scrollToBottom();
  }, [messages]);

  // 4. Send Message Handler
  const handleSendMessage = async (textOverride) => {
    if (isSessionExpired) return;
    const textToSend = typeof textOverride === 'string' ? textOverride : newMessage;
    if (!textToSend.trim() || !orderId) return;
    if (typeof textOverride !== 'string') setNewMessage('');
    setChatError(null);

    try {
      await setDoc(doc(db, 'chats', orderId), {
        orderId: orderId,
        updatedAt: serverTimestamp()
      }, { merge: true });

      await addDoc(collection(db, 'chats', orderId, 'messages'), {
        text: textToSend,
        senderId: currentUserId,
        role: 'astrologer',
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Astrologer send error:", error);
      if (isMountedRef.current) setChatError("Failed to send message.");
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return '00:00';
    const absSeconds = Math.max(0, seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMessageTimestamp = (createdAt) => {
    if (!createdAt) return '';
    let dateObj;
    if (createdAt.toDate) {
      dateObj = createdAt.toDate();
    } else if (createdAt.toMillis) {
      dateObj = new Date(createdAt.toMillis());
    } else {
      dateObj = new Date(createdAt);
    }

    if (isNaN(dateObj.getTime())) return '';

    return dateObj.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  return (
    <div className="flex h-screen bg-[#090510] text-gray-100 font-sans overflow-hidden">
      
      {/* 🔮 ASTROLOGER SIDEBAR */}
      <aside className="w-80 border-r border-purple-900/30 bg-[#0f091a] p-5 flex flex-col justify-between hidden md:flex overflow-y-auto shadow-2xl">
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-purple-900/40 pb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-xl shadow-md shadow-purple-950">
              🔮
            </div>
            <div>
              <h1 className="font-bold text-amber-300 text-sm tracking-wide">Astrologer Console</h1>
              <p className="text-[10px] text-purple-400 font-mono font-semibold uppercase">
                Order #{orderId ? orderId.slice(-6) : 'N/A'}
              </p>
            </div>
          </div>

          {/* User Details */}
          <div className="bg-[#170e28] p-3.5 rounded-xl border border-purple-800/40 space-y-2">
            <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Client Info</p>
            <div className="text-xs space-y-2 text-purple-200">
              <div className="flex justify-between items-center">
                <span className="text-purple-400">Status:</span>
                <span className={`font-bold text-[11px] px-2 py-0.5 rounded border ${
                  isSessionExpired 
                    ? 'text-red-400 bg-red-950/60 border-red-800/40' 
                    : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40'
                }`}>
                  {isSessionExpired ? 'Expired' : 'Active'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-400">Time Left:</span>
                <span className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded border ${
                  isSessionExpired || (timeLeft !== null && timeLeft < 30) 
                    ? 'bg-red-950/80 text-red-400 border-red-500/50 animate-pulse' 
                    : 'bg-amber-400/10 text-amber-300 border-amber-500/30'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Message Templates */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">Quick Replies</p>
            <div className="space-y-1.5">
              {templates.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(tpl)}
                  disabled={isSessionExpired || !orderId}
                  className="w-full text-left p-2.5 rounded-lg bg-[#170e28] border border-purple-800/40 text-xs text-purple-200 hover:bg-purple-900/40 hover:border-purple-600/50 transition-all disabled:opacity-40 cursor-pointer"
                >
                  {tpl}
                </button>
              ))}
            </div>
          </div>

          {/* Private Reading Notes */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">Private Notes</p>
            <textarea
              value={quickNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Jot down tarot card meanings or key details..."
              className="w-full h-24 bg-[#170e28] border border-purple-800/40 rounded-xl p-2.5 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-600/60 resize-none"
            />
          </div>
        </div>

        {/* End Session Button */}
        <button
          onClick={() => router.push('/')}
          className="w-full mt-4 py-2.5 bg-red-950/50 border border-red-800/40 text-red-300 rounded-xl text-xs font-semibold hover:bg-red-900/60 transition-all cursor-pointer shadow-md"
        >
          Exit Consultation
        </button>
      </aside>

      {/* 💬 MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col h-full bg-[#090510] relative">
        
        {/* Header */}
        <header className="px-6 py-3.5 border-b border-purple-900/30 flex items-center justify-between bg-[#0f091a]/95 backdrop-blur-md z-10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-purple-600 p-[1.5px]">
              <div className="w-full h-full bg-[#0d0714] rounded-full flex items-center justify-center text-lg">
                🔮
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-sm text-amber-200">Client Reading Room</h2>
              <p className="text-[11px] text-purple-400">Live Consultation Mode</p>
            </div>
          </div>

          {/* Timer Display */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono font-bold text-xs shadow-md ${
            isSessionExpired || (timeLeft !== null && timeLeft < 30)
              ? 'bg-red-950/80 text-red-400 border-red-500/50 animate-pulse' 
              : 'bg-purple-950/80 text-amber-300 border-purple-700/50'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isSessionExpired ? 'bg-red-500' : 'bg-amber-400 animate-pulse'}`}></span>
            {isSessionExpired ? 'EXPIRED' : formatTime(timeLeft)}
          </div>
        </header>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-purple-900/40 [&::-webkit-scrollbar-track]:bg-transparent">
          {chatError && (
            <div className="p-2.5 bg-red-950/60 border border-red-500/50 text-red-300 text-xs rounded-lg text-center font-mono">
              ⚠️ {chatError}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-purple-400 text-xs animate-pulse">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting session...</span>
            </div>
          ) : !orderId ? (
            <div className="flex items-center justify-center h-full text-amber-400/80 text-xs">
              Waiting for active order session...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-purple-400/60 text-xs text-center px-4">
              No messages in this session yet. Start the conversation using quick templates or type below.
            </div>
          ) : (
            messages.map((msg, index) => {
              const msgText = msg.text || msg.message || msg.content || "";
              const msgRole = msg.role || msg.senderRole || (msg.senderId === currentUserId ? 'astrologer' : 'user');
              const isMe = msgRole === 'astrologer';
              const formattedTime = formatMessageTimestamp(msg.createdAt);

              return (
                <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2.5 animate-fadeIn`}>
                  
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-purple-900 border border-purple-600/50 flex items-center justify-center text-xs text-purple-200 shadow-md flex-shrink-0 mb-1">
                      👤
                    </div>
                  )}

                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[82%] sm:max-w-md`}>
                    <span className="text-[10px] text-purple-300/60 font-medium px-1 mb-1">
                      {isMe ? 'You (Astrologer)' : 'User Client'}
                    </span>

                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                      isMe 
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 font-medium rounded-br-none border border-amber-400/40' 
                        : 'bg-[#1e1333] text-purple-100 rounded-bl-none border border-purple-800/40'
                    }`}>
                      <p className="whitespace-pre-wrap break-words text-[13.5px]">
                        {msgText}
                      </p>

                      {formattedTime && (
                        <div className={`text-[9px] mt-1.5 text-right font-mono ${
                          isMe ? 'text-amber-950/70' : 'text-purple-300/50'
                        }`}>
                          {formattedTime}
                        </div>
                      )}
                    </div>
                  </div>

                  {isMe && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-600 to-amber-800 border border-amber-400/40 flex items-center justify-center text-xs text-amber-100 shadow-md flex-shrink-0 mb-1">
                      🔮
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Textarea Input Bar */}
        <div className="p-4 bg-[#0f091a] border-t border-purple-900/40 shadow-2xl">
          {isSessionExpired ? (
            <div className="text-center py-3 text-xs font-semibold text-red-400 bg-red-950/40 border border-red-800/40 rounded-xl flex items-center justify-center gap-2">
              <span>⏳ Consultation session has expired. Redirecting to home page...</span>
            </div>
          ) : (
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                handleSendMessage(); 
              }} 
              className="flex items-end gap-2 bg-[#170e28] border border-purple-700/50 rounded-2xl p-2.5 pl-4 focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/30 transition-all shadow-inner"
            >
              <textarea
                rows={2}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your tarot reading response here... (Press Enter to send, Shift+Enter for new line)"
                disabled={isSessionExpired || !orderId}
                className="flex-1 bg-transparent text-sm text-gray-100 placeholder-purple-400/60 focus:outline-none resize-none disabled:opacity-50 min-h-[40px] max-h-[120px]"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim() || isSessionExpired || !orderId}
                className="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-all cursor-pointer shadow-md self-end"
              >
                <span>Send</span>
                <span className="text-sm">➤</span>
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AstrologerChatPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-[#090510] text-amber-400 flex items-center justify-center text-xs">
        Loading Astrologer Console...
      </div>
    }>
      <AstrologerChatContent />
    </Suspense>
  );
}