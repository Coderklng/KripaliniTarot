'use client';
export const dynamic = 'force-dynamic';

import dynamicComponent from 'next/dynamic';

import { Suspense } from 'react';

// Agora SDK ko server-side rendering (SSR) se completely bachane ke liye dynamic import karein
const VideoCallContent = dynamicComponent(
  () => import('../../Component/VideoCallContent'), // Agar aapne components folder mein rakha hai
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-[#090510] text-purple-400">
        Loading Secure Video Call...
      </div>
    )
  }
);

export default function VideoPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#090510] text-purple-400">Loading...</div>}>
      <VideoCallContent />
    </Suspense>
  );
}