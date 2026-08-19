'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Paperclip, X, CheckCheck } from 'lucide-react';
import Cookies from 'js-cookie';

function ChatUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const mode = searchParams.get('mode') || 'chat'; // 'video' | 'audio' | 'chat'

  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [chatError, setChatError] = useState(null);
  
  // Timer States with Cookie Sync
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const timerRef = useRef(null);

  // Call & Media States
  const [callActive, setCallActive] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const chatEndRef = useRef(null);
  const isMountedRef = useRef(true);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Auto-start Media if URL has mode=video or mode=audio
  useEffect(() => {
    if (mode === 'video' || mode === 'audio') {
      startMediaStream(mode === 'video');
    }
  }, [mode]);

  const startMediaStream = async (enableVideo) => {
    try {
      setCallActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: enableVideo,
        audio: true
      });
      if (localVideoRef.current && enableVideo) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("❌ Media stream error:", err);
    }
  };

  // 1. Initial Load, Server Validation & Cookie-Synced Timer + Firestore Parent Init
  useEffect(() => {
    if (!orderId) {
      console.warn("⚠️ No orderId provided in URL.");
      setLoading(false);
      return;
    }

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
            
            // 🚀 Timer 0 hote hi feedback page par orderId ke sath redirect
            router.push(`/session/feedback?orderId=${orderId}`);
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
          router.push(`/session/feedback?orderId=${orderId}`);
        }
      }
    }

    const initSession = async () => {
      try {
        const backendBase = process.env.NEXT_PUBLIC_API_BACKEND_URL || '';

        // 🔒 Server-side validation to check if session is already expired or valid
        const statusRes = await fetch(`${backendBase}/api/orders/${orderId}/status`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.status === 'EXPIRED' || (statusData.sessionEndTime && new Date(statusData.sessionEndTime).getTime() <= Date.now())) {
            if (isMountedRef.current) {
              setIsSessionExpired(true);
              setTimeLeft(0);
              Cookies.remove(cookieKey);
              setLoading(false);
              router.push(`/session/feedback?orderId=${orderId}`);
            }
            return;
          }
        }

        const res = await fetch(`${backendBase}/api/orders/${orderId}/start-chat`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.userId && isMountedRef.current) setCurrentUserId(data.userId);

          const serverEndTime = data.sessionEndTime 
            ? new Date(data.sessionEndTime).getTime() 
            : Date.now() + 15 * 60 * 1000; // Fallback 15 mins

          if (serverEndTime <= Date.now()) {
            if (isMountedRef.current) {
              setIsSessionExpired(true);
              setTimeLeft(0);
              router.push(`/session/feedback?orderId=${orderId}`);
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
        console.error("❌ Session Init Error:", err);
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

    // 2. Firestore Listener for Messages with standardized sorting
    let unsubscribe = () => {};
    try {
      const messagesRef = collection(db, 'chats', orderId, 'messages');
      unsubscribe = onSnapshot(
        messagesRef,
        (snapshot) => {
          const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
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
        },
        (err) => {
          console.error("❌ Firestore Error:", err);
          if (isMountedRef.current) {
            setChatError("Firestore Error: " + err.message);
            setLoading(false);
          }
        }
      );
    } catch (e) {
      console.error("❌ Firebase init error:", e);
      if (isMountedRef.current) setLoading(false);
    }

    return () => {
      unsubscribe();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [orderId, router]);

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAttachedFile(file);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if ((!newMessage.trim() && !attachedFile) || isSessionExpired || !orderId) return;

    const textToSend = newMessage;
    const fileToSend = attachedFile;
    
    setNewMessage('');
    setAttachedFile(null);
    setChatError(null);

    const backendBase = process.env.NEXT_PUBLIC_API_BACKEND_URL || '';

    try {
      if (fileToSend) {
        const formData = new FormData();
        formData.append('kundliFile', fileToSend);
        formData.append('text', textToSend);
        formData.append('senderId', currentUserId || 'user_client');

        const res = await fetch(`${backendBase}/api/orders/${orderId}/upload-file`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error("Failed to upload file to server");
      } else {
        const messagePayload = {
          text: textToSend,
          senderId: currentUserId || 'user_client',
          role: 'user',
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, 'chats', orderId, 'messages'), messagePayload);
      }
    } catch (error) {
      console.error("❌ Message/File send error:", error);
      if (isMountedRef.current) setChatError("Failed to send message. Check connection.");
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
    <div className="flex h-screen bg-[#07040d] text-gray-100 font-sans overflow-hidden">
      
      {/* 🔮 SIDEBAR */}
      <aside className="w-72 border-r border-purple-900/30 bg-[#0f091a] p-5 flex-col justify-between hidden md:flex shadow-2xl">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-purple-900/40 pb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-xl shadow-md shadow-purple-950">
              🔮
            </div>
            <div>
              <h1 className="font-bold text-amber-300 text-sm tracking-wide">Kripalini Tarot</h1>
              <p className="text-[10px] text-purple-400 tracking-widest uppercase font-semibold">User Dashboard</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">Session Details</p>
            <div className="bg-[#170e28] p-3.5 rounded-xl border border-purple-800/40 space-y-2.5">
              <div className="flex justify-between text-xs items-center">
                <span className="text-purple-400">Order ID:</span>
                <span className="text-amber-300 font-bold font-mono text-[11px] bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/30">
                  #{orderId ? orderId.slice(-6) : 'N/A'}
                </span>
              </div>

              <div className="flex justify-between text-xs items-center">
                <span className="text-purple-400">Mode:</span>
                <span className="text-amber-400 font-bold text-xs uppercase px-2 py-0.5 rounded bg-amber-400/10 border border-amber-500/30">
                  {mode}
                </span>
              </div>

              <div className="flex justify-between text-xs items-center">
                <span className="text-purple-400">Time Left:</span>
                <span className={`font-mono font-bold text-xs px-2.5 py-1 rounded-md border ${
                  isSessionExpired || (timeLeft !== null && timeLeft < 30) 
                    ? 'bg-red-950/80 text-red-400 border-red-500/50 animate-pulse' 
                    : 'bg-amber-400/10 text-amber-300 border-amber-500/30'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-950/30 p-3.5 rounded-xl border border-purple-800/30 text-xs text-purple-300/80 leading-relaxed">
          ✨ Type your queries or upload your Kundli document to get precise readings from your reader.
        </div>
      </aside>

      {/* 💬 MAIN CHAT WRAPPER */}
      <main className="flex-1 flex flex-col h-full bg-[#07040d] relative">
        
        {/* Chat Header */}
        <header className="px-6 py-3.5 border-b border-purple-900/30 flex items-center justify-between bg-[#11091f]/95 backdrop-blur-md z-10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-700 via-amber-600 to-purple-500 p-[1.5px]">
                <div className="w-full h-full bg-[#0d0714] rounded-full flex items-center justify-center text-lg shadow-inner">
                  🔮
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#07040d] animate-pulse"></span>
            </div>
            <div>
              <h2 className="font-semibold text-sm text-amber-200 tracking-wide">Astrologer Kripalini</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <p className="text-[10px] text-emerald-400 font-medium">Online • Live Session</p>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono font-bold text-xs shadow-md ${
            isSessionExpired || (timeLeft !== null && timeLeft < 30)
              ? 'bg-red-950/80 text-red-400 border-red-500/50 animate-pulse' 
              : 'bg-purple-950/80 text-amber-300 border-purple-700/50'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isSessionExpired ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'}`}></span>
            {isSessionExpired ? 'EXPIRED' : formatTime(timeLeft)}
          </div>
        </header>

        {/* Dynamic Video / Audio Stage */}
        {(mode === 'video' || mode === 'audio') && (
          <div className="p-4 bg-[#120a21] border-b border-purple-900/30 flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-48">
              {mode === 'video' ? (
                <>
                  <div className="relative bg-black/60 rounded-xl overflow-hidden border border-purple-800/40 flex items-center justify-center shadow-lg">
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-amber-300">You (Client)</span>
                  </div>
                  <div className="relative bg-black/60 rounded-xl overflow-hidden border border-purple-800/40 flex items-center justify-center shadow-lg">
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-amber-300">Astrologer Kripalini</span>
                  </div>
                </>
              ) : (
                <div className="col-span-2 bg-[#170e28] rounded-xl border border-purple-800/40 flex flex-col items-center justify-center text-purple-300 gap-2 shadow-inner">
                  <span className="text-3xl animate-bounce">🎙️</span>
                  <span className="text-xs font-semibold tracking-wide">Audio Call Session Active... Speak Clearly</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-purple-900/40 [&::-webkit-scrollbar-track]:bg-transparent">
          {chatError && (
            <div className="p-2.5 bg-red-950/60 border border-red-500/50 text-red-300 text-xs rounded-lg text-center font-mono">
              ⚠️ {chatError}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-purple-400 text-xs animate-pulse">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting session securely...</span>
            </div>
          ) : !orderId ? (
            <div className="flex items-center justify-center h-full text-amber-400/80 text-xs">
              Invalid or missing Order Session ID in URL.
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-purple-400/60 text-xs text-center px-4">
              ✨ Session started! Send your first message or upload your Kundli document to begin.
            </div>
          ) : (
            messages.map((msg, index) => {
              const msgText = msg.text || msg.message || msg.content || "";
              const msgRole = msg.role || msg.senderRole || (msg.senderId === currentUserId ? 'user' : 'astrologer');
              const isMe = msgRole === 'user';
              const formattedTime = formatMessageTimestamp(msg.createdAt);

              return (
                <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2.5 group animate-fadeIn`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-600 to-amber-800 border border-amber-400/40 flex items-center justify-center text-xs text-amber-100 shadow-md flex-shrink-0 mb-1">
                      🔮
                    </div>
                  )}

                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[82%] sm:max-w-md`}>
                    <span className="text-[10px] text-purple-300/60 font-medium px-1 mb-1">
                      {isMe ? 'You' : 'Astrologer Kripalini'}
                    </span>

                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-xl transition-all ${
                      isMe 
                        ? 'bg-gradient-to-br from-purple-700 to-purple-800 text-purple-50 rounded-br-none border border-purple-500/40' 
                        : 'bg-[#181026] text-amber-100 rounded-bl-none border border-amber-500/30'
                    }`}>
                      <p className="whitespace-pre-wrap break-words font-normal text-[13.5px]">
                        {msgText}
                      </p>

                      {msg.fileUrl && (
                        <div className="mt-2 pt-2 border-t border-purple-500/30">
                          <a 
                            href={msg.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-medium bg-black/30 px-2.5 py-1.5 rounded-lg border border-amber-400/20 transition-colors"
                          >
                            <span>📎</span>
                            <span className="truncate max-w-[200px]">{msg.fileName || 'View Attached File'}</span>
                          </a>
                        </div>
                      )}

                      <div className={`flex items-center justify-end gap-1 text-[9px] mt-1.5 font-mono ${
                        isMe ? 'text-purple-200/70' : 'text-amber-200/50'
                      }`}>
                        <span>{formattedTime}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-amber-400" />}
                      </div>
                    </div>
                  </div>

                  {isMe && (
                    <div className="w-8 h-8 rounded-full bg-purple-900/80 border border-purple-600/50 flex items-center justify-center text-xs text-purple-200 shadow-md flex-shrink-0 mb-1">
                      👤
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Footer Bar */}
        <div className="p-4 bg-[#0f091a] border-t border-purple-900/40 shadow-2xl">
          {isSessionExpired ? (
            <div className="text-center py-2.5 text-xs font-medium text-red-400 bg-red-950/40 border border-red-800/40 rounded-xl">
              ⏳ Session time has ended. Redirecting to feedback page...
            </div>
          ) : (
            <form 
              onSubmit={handleSendMessage} 
              className="flex flex-col gap-2 bg-[#170e28] border border-purple-700/50 rounded-2xl p-2 pl-3 focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/30 transition-all shadow-inner"
            >
              {attachedFile && (
                <div className="flex items-center justify-between bg-purple-900/40 border border-purple-700/40 px-3 py-1.5 rounded-xl text-xs text-amber-200 animate-fadeIn">
                  <span className="truncate max-w-[280px]">📎 Kundli File: {attachedFile.name}</span>
                  <button 
                    type="button" 
                    onClick={() => setAttachedFile(null)} 
                    className="text-purple-300 hover:text-red-400 transition-colors p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2">
                <label className="cursor-pointer p-2.5 text-purple-300 hover:text-amber-300 transition-colors rounded-xl hover:bg-purple-950/40 flex items-center justify-center">
                  <Paperclip className="w-5 h-5" />
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf,.txt,.png,.jpg,.jpeg" 
                  />
                </label>

                <textarea
                  rows={1}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message or upload your Kundli... (Press Enter to send)"
                  disabled={isSessionExpired || !orderId}
                  className="flex-1 bg-transparent text-sm text-gray-100 placeholder-purple-400/60 focus:outline-none resize-none disabled:opacity-50 min-h-[40px] max-h-[120px] py-2"
                />

                <button 
                  type="submit" 
                  disabled={(!newMessage.trim() && !attachedFile) || isSessionExpired || !orderId}
                  className="h-10 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-all cursor-pointer shadow-md self-end"
                >
                  <span>Send</span>
                  <span className="text-sm">➤</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function UserChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#07040d] text-amber-400">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ChatUI />
    </Suspense>
  );
}