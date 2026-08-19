'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
// Agar tu Firebase phone auth confirmation object ko props ya state mein pass kar raha hai, 
// toh wahan se handle kar lena. Yahan hum clean UI component de rahe hain.

export default function VerifyOtpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      // Yahan apna confirmationResult.confirm(otp) wala logic daal dena jo Firebase se aata hai
      // Example:
      // const result = await confirmationResult.confirm(otp);
      // const token = await result.user.getIdToken();

      // Dummy delay simulation for testing UI
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success hone par home page ya dashboard par bhej do
      router.push('/');
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a1d] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient subtle glows matching your login page */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Form Container */}
      <div className="max-w-[460px] w-full bg-[#141026]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[28px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-amber-100 tracking-wide font-medium">Verify Phone</h2>
          <p className="text-xs text-purple-300/60 mt-1.5">Enter the 6-digit security code sent to your phone</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4" noValidate>
          
          {/* OTP Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-purple-200/70 ml-1">Security Code / OTP</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400/50">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1e1738]/60 text-white placeholder-purple-300/30 border border-purple-500/30 focus:border-amber-400/80 focus:ring-4 focus:ring-amber-400/10 rounded-xl text-xs tracking-widest outline-none font-bold text-center"
                placeholder="123456"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 text-zinc-950 font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(251,191,36,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
            ) : (
              <>
                <span>Verify OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Back to Login Link */}
        <p className="text-xs text-center text-purple-300/70 mt-6">
          Didn't receive the code?{' '}
          <button onClick={() => alert("Resend OTP clicked!")} className="text-amber-300 font-semibold hover:text-amber-200 hover:underline bg-transparent border-none cursor-pointer">
            Resend
          </button>
        </p>

      </div>
    </div>
  );
}