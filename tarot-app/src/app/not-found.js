// app/not-found.js
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-zinc-100 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-violet-800/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center max-w-lg w-full relative z-10">
        {/* Main 404 Text */}
        <h1 className="text-[10rem] sm:text-[13rem] font-black leading-none bg-gradient-to-b from-purple-300 via-purple-500 to-violet-900 bg-clip-text text-transparent tracking-tighter drop-shadow-2xl">
          404
        </h1>

        {/* Text Section */}
        <div className="space-y-3 -mt-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
            Oops! Page nahi mila
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Aap jis route ko access karne ki koshish kar rahe hain woh exist nahi karta ya move ho chuka hai.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-600 rounded-full transition-all duration-200 hover:from-purple-500 hover:to-violet-500 active:scale-95 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] w-full sm:w-auto"
          >
            <span>Home Page Par Jayein</span>
            <svg 
              className="w-4 h-4 ml-2.5 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <Link
            href="/contact"
            className="px-8 py-3.5 text-sm font-semibold text-zinc-300 bg-zinc-900/80 border border-purple-900/40 rounded-full hover:bg-zinc-800 hover:text-white hover:border-purple-600/50 transition-all duration-200 backdrop-blur-md w-full sm:w-auto"
          >
            Report Problem
          </Link>
        </div>
      </div>
    </div>
  );
}