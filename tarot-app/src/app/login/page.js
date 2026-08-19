'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { loginSchema } from '../../lib/validation/auth';
import { Loader2, Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState({ text: '', type: '' });
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  // Direct payload authentication to avoid token verification errors
  const handleBackendAuthentication = async (firebaseUser) => {
    if (!firebaseUser) throw new Error('No user data found.');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: firebaseUser.email, 
        name: firebaseUser.displayName || "User" 
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Login failed');

    Cookies.set('token', result.token, { 
      expires: 7, 
      secure: window.location.protocol === 'https:', 
      sameSite: 'strict' 
    });

    if (result.role === "admin") {
      Cookies.set('admin', result.token, { 
        expires: 7, 
        secure: window.location.protocol === 'https:', 
        sameSite: 'strict' 
      });
    }

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      await handleBackendAuthentication(userCredential.user);
    } catch (error) {
      console.error("Login Error:", error);
      let msg = error.message;
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      }
      alert(msg || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleBackendAuthentication(result.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert(error.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetMessage({ text: 'Please enter your email address first.', type: 'error' });
      return;
    }

    setResetLoading(true);
    setResetMessage({ text: '', type: '' });

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage({ text: 'Password reset link sent! Check your inbox.', type: 'success' });
      setResetEmail('');
    } catch (err) {
      console.error("Reset Password Error:", err);
      let msg = err.message;
      if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email address.';
      }
      setResetMessage({ text: msg || 'Failed to send reset link.', type: 'error' });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a1d] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient subtle glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Form Container */}
      <div className="max-w-[460px] w-full bg-[#141026]/85 backdrop-blur-2xl border border-purple-500/20 rounded-[28px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-amber-100 tracking-wide font-medium">Welcome Back</h2>
          <p className="text-xs text-purple-300/60 mt-1.5">Sign in to continue your tarot journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-purple-200/70 ml-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400/50">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-3 bg-[#1e1738]/60 text-white placeholder-purple-300/30 border rounded-xl text-xs transition-all outline-none ${
                  errors.email
                    ? 'border-red-400/60 focus:border-red-400'
                    : 'border-purple-500/30 focus:border-amber-400/80'
                }`}
                placeholder="example@mail.com"
              />
            </div>
            {errors.email && <p className="text-red-300 text-[11px] mt-1 ml-1 font-medium">{errors.email.message}</p>}
          </div>

          {/* Password & Forgot Password Link */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1 mr-1">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-purple-200/70">Password</label>
              <button
                type="button"
                onClick={() => { setResetModalOpen(true); setResetMessage({ text: '', type: '' }); }}
                className="text-[11px] text-amber-300/80 hover:text-amber-300 hover:underline transition-colors bg-transparent border-none cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400/50">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                {...register('password')}
                className={`w-full pl-10 pr-4 py-3 bg-[#1e1738]/60 text-white placeholder-purple-300/30 border rounded-xl text-xs transition-all outline-none ${
                  errors.password
                    ? 'border-red-400/60 focus:border-red-400'
                    : 'border-purple-500/30 focus:border-amber-400/80'
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-300 text-[11px] mt-1 ml-1 font-medium">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 text-zinc-950 font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(251,191,36,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
            ) : (
              <>
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow border-t border-purple-500/20"></div>
          <span className="px-3 text-[10px] uppercase tracking-widest text-purple-300/50">Or continue with</span>
          <div className="flex-grow border-t border-purple-500/20"></div>
        </div>

        {/* Google Login Button with Official SVG Icon */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full bg-[#1e1738]/60 hover:bg-[#251d47] border border-purple-500/30 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3 text-xs tracking-wide cursor-pointer disabled:opacity-50 shadow-md"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Footer Register Link */}
        <p className="text-xs text-center text-purple-300/70 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-amber-300 font-semibold hover:text-amber-200 hover:underline">
            Register
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#141026] border border-purple-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.7)] relative">
            
            <h3 className="text-xl font-serif text-amber-100 font-medium mb-2">Reset Password</h3>
            <p className="text-xs text-purple-300/70 mb-5">
              Enter your registered email address, and we'll send you a secure link to reset your password via Firebase.
            </p>

            {resetMessage.text && (
              <div className={`mb-4 p-3 rounded-xl text-xs font-medium text-center ${
                resetMessage.type === 'error' ? 'bg-red-500/10 border border-red-500/30 text-red-300' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              }`}>
                {resetMessage.text}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-purple-200/70 ml-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400/50">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1e1738]/60 text-white placeholder-purple-300/30 border border-purple-500/30 focus:border-amber-400/80 rounded-xl text-xs outline-none transition-all"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="w-1/2 bg-[#1e1738]/60 hover:bg-[#251d47] text-purple-200 font-medium py-3 rounded-xl transition-all text-xs border border-purple-500/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-1/2 bg-gradient-to-r from-amber-300 to-amber-500 hover:brightness-110 text-zinc-950 font-bold py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(251,191,36,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
                >
                  {resetLoading ? <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> : 'Send Link'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}