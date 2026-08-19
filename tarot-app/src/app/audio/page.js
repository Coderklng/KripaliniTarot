'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mic, MicOff, Phone, PhoneOff, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID;

function AudioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId") || searchParams.get("order_id") || searchParams.get("id");

  // --- Audio Calling States ---
  const [callState, setCallState] = useState('ringing'); // 'ringing', 'connected'
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  // --- Live Timer States with Server Sync ---
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const timerRef = useRef(null);
  const timeOffsetRef = useRef(0); // Server aur Client ke time ka exact difference

  const clientRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const remoteUsersRef = useRef({});
  const isInitializingRef = useRef(false);
  const isMountedRef = useRef(true);
  const ringtoneRef = useRef(null);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '00:00';
    const absSeconds = Math.max(0, seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Play WhatsApp-like Ringtone using Web Audio API
  const playRingtone = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playTone = () => {
        if (!isMountedRef.current || callState !== 'ringing') return;
        
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, ctx.currentTime);
        osc2.frequency.setValueAtTime(480, ctx.currentTime);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.5);
        osc2.stop(ctx.currentTime + 1.5);
      };

      playTone();
      ringtoneRef.current = setInterval(playTone, 3000);
    } catch (e) {
      console.error("Ringtone error:", e);
    }
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      clearInterval(ringtoneRef.current);
      ringtoneRef.current = null;
    }
  };

  const handleEndCall = async () => {
    try {
      stopRingtone();
      if (timerRef.current) clearInterval(timerRef.current);

      if (orderId) {
        // Shared cookie key taaki cleanup dono taraf clean rahe
        Cookies.remove(`session_end_${orderId}`);
      }

      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }

      if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
        } catch (e) {}
      }

      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current.removeAllListeners();
        clientRef.current = null;
      }
    } catch (e) {
      console.error("End call cleanup error:", e);
    }
    
    router.push(`/session/feedback?orderId=${orderId || ''}`);
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (!orderId) {
      setError("No Order ID provided.");
      return;
    }

    if (callState === 'ringing') {
      playRingtone();
    }

    return () => {
      isMountedRef.current = false;
      stopRingtone();
    };
  }, [callState]);

  // Accept Call & Initialize Agora + Timer securely with Shared Server Sync
  const handleAcceptCall = async () => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;

    stopRingtone();
    setCallState('connected');
    setLoading(true);

    // Shared cookie key use ki gayi hai taaki video aur audio dono ek hi expiry time read karein
    const cookieKey = `session_end_${orderId}`;
    let targetEndTime = null;

    const savedEndTimeCookie = Cookies.get(cookieKey);
    if (savedEndTimeCookie) {
      targetEndTime = parseInt(savedEndTimeCookie, 10);
    }

    const startTimerWithTarget = (endTimeMs) => {
      if (timerRef.current) clearInterval(timerRef.current);

      const updateCountdown = () => {
        // Real-time calculation using Date.now() + offset to prevent drift across components
        const synchronizedNow = Date.now() + timeOffsetRef.current;
        const distance = Math.floor((endTimeMs - synchronizedNow) / 1000);
        
        if (distance <= 0) {
          clearInterval(timerRef.current);
          setTimeLeft(0);
          setIsSessionExpired(true);
          Cookies.remove(cookieKey);
          handleEndCall();
        } else {
          setTimeLeft(distance);
        }
      };

      updateCountdown();
      timerRef.current = setInterval(updateCountdown, 1000);
    };

    if (targetEndTime && targetEndTime > Date.now()) {
      startTimerWithTarget(targetEndTime);
    }

    try {
      if (clientRef.current) {
        try { await clientRef.current.leave(); } catch (e) {}
        clientRef.current.removeAllListeners();
        clientRef.current = null;
      }
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }

      const token = Cookies.get("admin") || Cookies.get("token") || localStorage.getItem("token");
      const backendBase = process.env.NEXT_PUBLIC_API_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || '';

      const sessionRes = await fetch(`${backendBase}/api/orders/${orderId}/start-chat`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (sessionRes.ok) {
        const sessionJson = await sessionRes.json();
        setSessionData(sessionJson);

        // Server time offset calculate karna from headers
        const serverDateHeader = sessionRes.headers.get('Date');
        if (serverDateHeader) {
          const serverTime = new Date(serverDateHeader).getTime();
          timeOffsetRef.current = serverTime - Date.now();
        }

        const serverEndTime = sessionJson.sessionEndTime 
          ? new Date(sessionJson.sessionEndTime).getTime() 
          : Date.now() + 15 * 60 * 1000;

        if (isMountedRef.current) {
          Cookies.set(cookieKey, serverEndTime.toString(), { expires: 1 });
          startTimerWithTarget(serverEndTime);
        }
      } else {
        const fallbackRes = await fetch(`${backendBase}/api/orders/session/${orderId}`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setSessionData(fallbackData);
        }

        if (!targetEndTime) {
          const fallbackEnd = Date.now() + 15 * 60 * 1000;
          if (isMountedRef.current) {
            Cookies.set(cookieKey, fallbackEnd.toString(), { expires: 1 });
            startTimerWithTarget(fallbackEnd);
          }
        }
      }

      if (!APP_ID) {
        setError('Agora App ID is not configured.');
        setLoading(false);
        isInitializingRef.current = false;
        return;
      }

      const tokenRes = await axios.get(`${backendBase}/api/agora/token/${orderId}`, {
        headers: { Authorization: `Bearer ${token || ''}` }
      });

      const data = tokenRes.data;
      if (!isMountedRef.current) return;

      if (!data.success) {
        setError(data.message || 'Failed to fetch Agora token.');
        setLoading(false);
        isInitializingRef.current = false;
        return;
      }

      const { token: agoraToken, uid } = data;
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;

      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (!isMountedRef.current) return;

        if (mediaType === 'audio') {
          remoteUsersRef.current[user.uid] = user;
          user.audioTrack.py?.() || user.audioTrack.play();
          setCallConnected(true);
        }
      });

      client.on('user-unpublished', (user) => {
        delete remoteUsersRef.current[user.uid];
      });

      await client.join(APP_ID, orderId, agoraToken, uid);

      if (!isMountedRef.current) {
        await client.leave();
        return;
      }

      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localAudioTrackRef.current = audioTrack;
      await client.publish([audioTrack]);

      setLoading(false);
      setCallConnected(true);

    } catch (err) {
      console.error("❌ Audio Session Error:", err);
      if (isMountedRef.current) {
        setError(err.response?.data?.message || err.message || "Failed to initialize audio session.");
        setLoading(false);
      }
    } finally {
      isInitializingRef.current = false;
    }
  };

  const toggleMute = () => {
    if (localAudioTrackRef.current) {
      const newMuteState = !isMuted;
      localAudioTrackRef.current.setEnabled(!newMuteState);
      setIsMuted(newMuteState);
    }
  };

  if (!orderId) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#07040d] text-amber-400">
        Invalid Session: Missing Order ID in URL.
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#07040d] text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-950/40 border border-red-500/50 p-6 rounded-2xl text-center space-y-3">
          <h2 className="text-red-400 text-sm font-bold">Session Error</h2>
          <p className="text-zinc-300 text-xs leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030107] text-white flex items-center justify-center p-2 sm:p-6 select-none overflow-hidden">
      <div className="relative w-full max-w-[400px] h-[820px] max-h-[95vh] bg-[#07040d] border-[8px] border-[#221b36] rounded-[45px] shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#140e21] rounded-full z-50 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-black/60 border border-purple-900/30" />
          <div className="w-10 h-1 bg-purple-950 rounded-full" />
        </div>

        <div className="flex-1 flex flex-col pt-10 pb-6 px-4 justify-between relative overflow-y-auto">
          {callState === 'ringing' ? (
            <div className="flex-1 flex flex-col items-center justify-between py-6">
              <div className="flex flex-col items-center mt-10 space-y-4 animate-pulse">
                <div className="w-28 h-28 rounded-full bg-amber-400/15 border-2 border-amber-400/60 flex items-center justify-center shadow-2xl">
                  <span className="text-5xl">🔮</span>
                </div>
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-serif text-amber-200 tracking-wide">Astrologer Kripalini</h2>
                  <p className="text-[11px] text-purple-400 font-mono tracking-widest uppercase">Incoming Audio Call...</p>
                </div>
              </div>

              <div className="w-full max-w-xs flex items-center justify-around mb-6">
                <button onClick={handleEndCall} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg shadow-red-600/40 transition-transform active:scale-95">
                    <PhoneOff className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium">Decline</span>
                </button>

                <button onClick={handleAcceptCall} className="flex flex-col items-center gap-2 group cursor-pointer animate-bounce">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/40 transition-transform active:scale-95">
                    <Phone className="w-6 h-6 text-white rotate-90" />
                  </div>
                  <span className="text-[11px] text-zinc-300 font-medium">Accept</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <header className="w-full flex items-center justify-between bg-purple-950/20 border border-purple-500/20 px-3 py-2.5 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-medium text-amber-200">Live Audio Session</span>
                </div>
                <div className={`px-2.5 py-0.5 rounded-full border font-mono text-[11px] font-bold ${
                  isSessionExpired || (timeLeft !== null && timeLeft < 30)
                    ? 'bg-red-950/80 text-red-400 border-red-500/50 animate-pulse'
                    : 'bg-purple-900/30 text-amber-300 border-purple-500/30'
                }`}>
                  {isSessionExpired ? 'EXPIRED' : formatTime(timeLeft)}
                </div>
              </header>

              <div className="w-full bg-purple-950/20 border border-purple-500/20 p-6 rounded-3xl text-center backdrop-blur-md shadow-2xl my-auto">
                <div className="w-20 h-20 rounded-full bg-amber-400/10 border border-amber-400/40 flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg shadow-amber-500/10">
                  <Mic className="w-9 h-9 text-amber-300" />
                </div>
                <h1 className="text-lg font-serif text-amber-200 mb-1">Live Audio Tarot Reading</h1>
                <p className="text-[10px] text-zinc-400 mb-5 font-mono">Order ID: #{orderId ? orderId.slice(-6) : 'N/A'}</p>
                
                <div className="p-3 rounded-xl bg-purple-900/30 border border-purple-500/30 text-[11px] text-amber-100/90 mb-6 leading-relaxed">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Connecting audio stream...</span>
                    </div>
                  ) : callConnected ? (
                    "🟢 Connected! Speak clearly with your Reader."
                  ) : (
                    "Waiting for reader response..."
                  )}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={toggleMute}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center cursor-pointer ${
                      isMuted 
                        ? 'bg-red-950/80 border-red-500/50 text-red-400' 
                        : 'bg-purple-900/40 border-purple-500/40 text-amber-300 hover:bg-purple-800/40'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button 
                    onClick={handleEndCall}
                    className="flex-1 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Call</span>
                  </button>
                </div>
              </div>

              <div className="text-[9px] text-zinc-500 font-mono text-center">
                Secured by Agora Voice SDK
              </div>
            </>
          )}
        </div>
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
}

export default function AudioSessionPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#07040d] text-purple-400">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        <span className="ml-2 text-xs">Loading Audio Room...</span>
      </div>
    }>
      <AudioContent />
    </Suspense>
  );
}