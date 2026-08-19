'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import Cookies from 'js-cookie';

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID;

export default function VideoCallContent({ authToken }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId') || searchParams.get('order_id') || searchParams.get('id');

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [permissionError, setPermissionError] = useState(null);

  // --- Live Timer States with Server Sync ---
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const timerRef = useRef(null);
  const timeOffsetRef = useRef(0); // Server aur Client ke time ka difference store karne ke liye

  // --- Swap / Expand State ---
  const [isExpanded, setIsExpanded] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  const clientRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const remoteUsersRef = useRef({});
  
  const isInitializingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '00:00';
    const absSeconds = Math.max(0, seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    try {
      if (timerRef.current) clearInterval(timerRef.current);

      if (orderId) {
        Cookies.remove(`session_end_${orderId}`);
      }

      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.stop();
        localVideoTrackRef.current.close();
        localVideoTrackRef.current = null;
      }

      if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
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

  const handleWheel = (e) => {
    e.preventDefault();
    setScale((prevScale) => {
      let newScale = prevScale + (e.deltaY < 0 ? 0.1 : -0.1);
      if (newScale < 1) newScale = 1;
      if (newScale > 3) newScale = 3;
      return newScale;
    });
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (!orderId) return;

    const cookieKey = `session_end_${orderId}`;

    const startTimerWithTarget = (endTimeMs) => {
      if (timerRef.current) clearInterval(timerRef.current);

      const updateCountdown = () => {
        // Server time offset ko include karke current accurate time nikalna
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

    // Pehle cookie check karo agar already chal raha hai
    const savedEndTimeCookie = Cookies.get(cookieKey);
    if (savedEndTimeCookie) {
      const targetEndTime = parseInt(savedEndTimeCookie, 10);
      if (targetEndTime > Date.now()) {
        startTimerWithTarget(targetEndTime);
      }
    }

    async function initAgoraAndSession() {
      if (isInitializingRef.current || clientRef.current) return;
      isInitializingRef.current = true;

      try {
        setPermissionError(null);

        if (!APP_ID) {
          console.error('❌ NEXT_PUBLIC_AGORA_APP_ID is missing');
          isInitializingRef.current = false;
          return;
        }

        const backendBase = process.env.NEXT_PUBLIC_API_BACKEND_URL || 'https://pulled-crafts-serving-craft.trycloudflare.com';

        const sessionRes = await fetch(`${backendBase}/api/orders/${orderId}/start-chat`, {
          method: 'PUT',
          headers: {
            'Authorization': authToken ? `Bearer ${authToken}` : '',
            'Content-Type': 'application/json'
          }
        });

        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          
          // Server response se Date header ya server time calculate karna
          const serverDateHeader = sessionRes.headers.get('Date');
          if (serverDateHeader) {
            const serverTime = new Date(serverDateHeader).getTime();
            timeOffsetRef.current = serverTime - Date.now(); // Difference store kar liya
          }

          const serverEndTime = sessionData.sessionEndTime 
            ? new Date(sessionData.sessionEndTime).getTime() 
            : Date.now() + 15 * 60 * 1000;

          if (isMountedRef.current) {
            Cookies.set(cookieKey, serverEndTime.toString(), { expires: 1 });
            startTimerWithTarget(serverEndTime);
          }
        } else {
          if (!savedEndTimeCookie) {
            const fallbackEnd = Date.now() + 15 * 60 * 1000;
            if (isMountedRef.current) {
              Cookies.set(cookieKey, fallbackEnd.toString(), { expires: 1 });
              startTimerWithTarget(fallbackEnd);
            }
          }
        }

        const response = await axios.get(`${backendBase}/api/agora/token/${orderId}`, {
          headers: {
            Authorization: `Bearer ${authToken || ''}`
          }
        });

        const data = response.data;
        if (!isMountedRef.current) return;

        if (!data.success) {
          console.error('❌ Failed to fetch Agora token:', data.message);
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

          if (mediaType === 'video') {
            remoteUsersRef.current[user.uid] = user;
            setTimeout(() => {
              if (document.getElementById('remote-video-container')) {
                user.videoTrack.play('remote-video-container');
              }
              if (document.getElementById('small-remote-container')) {
                user.videoTrack.play('small-remote-container');
              }
            }, 100);
            setCallConnected(true);
          }
          if (mediaType === 'audio') {
            user.audioTrack.play();
          }
        });

        client.on('user-unpublished', (user, mediaType) => {
          if (mediaType === 'video') {
            delete remoteUsersRef.current[user.uid];
            if (Object.keys(remoteUsersRef.current).length === 0) {
              setCallConnected(false);
            }
          }
        });

        await client.join(APP_ID, orderId, agoraToken, uid);

        if (!isMountedRef.current) {
          await client.leave();
          return;
        }

        let audioTrack, videoTrack;
        try {
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
          videoTrack = await AgoraRTC.createCameraVideoTrack();
        } catch (mediaErr) {
          setPermissionError("Microphone or Camera access was denied. Please allow permissions in browser settings.");
          isInitializingRef.current = false;
          return;
        }

        if (!isMountedRef.current) {
          audioTrack.close();
          videoTrack.close();
          return;
        }

        localAudioTrackRef.current = audioTrack;
        localVideoTrackRef.current = videoTrack;

        setTimeout(() => {
          if (document.getElementById('local-video-container')) {
            videoTrack.play('local-video-container');
          }
          if (document.getElementById('small-local-container')) {
            videoTrack.play('small-local-container');
          }
        }, 100);

        await client.publish([audioTrack, videoTrack]);

      } catch (err) {
        console.error('❌ Agora / Session Initialization Error:', err);
      } finally {
        isInitializingRef.current = false;
      }
    }

    initAgoraAndSession();

    return () => {
      isMountedRef.current = false;
      isInitializingRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);

      const cleanupAgora = async () => {
        try {
          if (localAudioTrackRef.current) {
            localAudioTrackRef.current.stop();
            localAudioTrackRef.current.close();
            localAudioTrackRef.current = null;
          }
          if (localVideoTrackRef.current) {
            localVideoTrackRef.current.stop();
            localVideoTrackRef.current.close();
            localVideoTrackRef.current = null;
          }
          if (clientRef.current) {
            await clientRef.current.leave();
            clientRef.current = null;
          }
        } catch (e) {}
      };

      cleanupAgora();
    };
  }, [orderId, authToken]);

  const toggleMute = () => {
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.setEnabled(isMuted);
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (localVideoTrackRef.current) {
      localVideoTrackRef.current.setEnabled(isVideoOff);
    }
    setIsVideoOff(!isVideoOff);
  };

  if (!orderId) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#090510] text-amber-400">
        Invalid Session: Missing Order ID in URL.
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-[#090510] text-white overflow-hidden">
      <header className="flex items-center justify-between border-b border-purple-900/30 bg-[#0f091a] px-6 py-3 z-20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 text-xl shadow-md">
            🔮
          </div>
          <div>
            <h1 className="text-sm font-bold text-amber-300">Astrologer Kripalini</h1>
            <p className="text-[11px] text-purple-400">Live Video Reading</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs font-bold ${
            isSessionExpired || (timeLeft !== null && timeLeft < 30)
              ? 'bg-red-950/80 text-red-400 border-red-500/50 animate-pulse' 
              : 'bg-purple-950/60 text-amber-300 border-purple-700/50'
          }`}>
            <span className={`h-2 w-2 rounded-full ${isSessionExpired ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'}`}></span>
            {isSessionExpired ? 'EXPIRED' : formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <main ref={containerRef} className="relative flex-1 p-4 md:p-6 overflow-hidden">
        {permissionError ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="max-w-md w-full bg-red-950/40 border border-red-500/50 p-6 rounded-2xl text-center space-y-3 shadow-2xl">
              <span className="text-3xl">⚠️</span>
              <h3 className="text-red-400 font-bold text-sm">Camera / Microphone Access Required</h3>
              <p className="text-xs text-red-200/80 leading-relaxed">{permissionError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Retry / Refresh Page
              </button>
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-purple-900/40 bg-[#0f091a] flex items-center justify-center">
            <div className="relative h-full w-full bg-black/80 flex items-center justify-center">
              {isExpanded ? (
                <>
                  <div id="local-video-container" className="h-full w-full object-cover"></div>
                  <div className="absolute top-4 left-4 rounded-md bg-black/60 px-3 py-1 text-xs text-amber-300 backdrop-blur-md z-20">
                    You (Main Screen)
                  </div>
                </>
              ) : (
                <>
                  <div id="remote-video-container" className="h-full w-full object-cover"></div>
                  {!callConnected && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#090510]/90 text-purple-300 gap-3 z-10">
                      <div className="h-10 w-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-amber-200">Waiting for Astrologer to join...</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 rounded-md bg-black/60 px-3 py-1 text-xs text-amber-300 backdrop-blur-md z-20">
                    🔮 Astrologer Kripalini {callConnected ? '' : '(Connecting...)'}
                  </div>
                </>
              )}
            </div>

            <motion.div
              drag
              dragConstraints={containerRef}
              dragElastic={0.1}
              onWheel={handleWheel}
              animate={{ scale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute bottom-6 right-6 h-36 w-28 sm:h-48 sm:w-36 overflow-hidden rounded-xl border-2 border-purple-600/50 bg-black shadow-2xl z-30 cursor-pointer active:cursor-grabbing select-none hover:border-amber-400 transition-colors"
            >
              {isExpanded ? (
                <div className="relative h-full w-full">
                  <div id="small-remote-container" className="h-full w-full object-cover pointer-events-none"></div>
                  <div className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-purple-200 z-20 pointer-events-none">
                    Astrologer
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <div id="small-local-container" className="h-full w-full object-cover pointer-events-none"></div>
                  {isVideoOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-xs text-gray-400 z-10">
                      Camera Off
                    </div>
                  )}
                  <div className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-purple-200 z-20 pointer-events-none">
                    You
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </main>

      <footer className="flex items-center justify-center gap-4 border-t border-purple-900/30 bg-[#0f091a] py-4 z-20">
        <button
          onClick={toggleMute}
          className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
            isMuted ? 'border-red-500/50 bg-red-950/80 text-red-400' : 'border-purple-700/50 bg-[#170e28] text-purple-200 hover:bg-purple-900/50'
          }`}
        >
          {isMuted ? '🎙️❌' : '🎙️'}
        </button>

        <button
          onClick={handleEndCall}
          className="flex h-12 px-6 items-center justify-center gap-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
        >
          <span>📞</span> End Call
        </button>

        <button
          onClick={toggleVideo}
          className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
            isVideoOff ? 'border-red-500/50 bg-red-950/80 text-red-400' : 'border-purple-700/50 bg-[#170e28] text-purple-200 hover:bg-purple-900/50'
          }`}
        >
          {isVideoOff ? '📹❌' : '📹'}
        </button>
      </footer>
    </div>
  );
}