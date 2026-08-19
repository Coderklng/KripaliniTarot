'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Email & Password Registration Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          uid: firebaseUser.uid, 
          name: formData.name, 
          email: formData.email,
          password: formData.password 
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Backend registration failed');
      
      localStorage.setItem('token', token);
      setTimeout(() => { router.push("/"); }, 1000);

    } catch (err) {
      console.error("Registration Error:", err);
      let msg = err.message;
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered.';
      }
      setError(msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Google Sign-In / Registration Handler
  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const token = await firebaseUser.getIdToken();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          uid: firebaseUser.uid, 
          name: firebaseUser.displayName || 'Tarot User', 
          email: firebaseUser.email,
          password: "google_oauth_user_secure_pass" // Dummy password for Google users to bypass validations
        }),
      });

      const backendResult = await response.json();
      if (!response.ok) throw new Error(backendResult.message || 'Google authentication failed on backend');

      localStorage.setItem('token', token);
      setTimeout(() => { router.push("/"); }, 1000);

    } catch (err) {
      console.error("Google Auth Error:", err);
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a1d] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[460px] w-full bg-[#141026]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[28px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-amber-100 tracking-wide font-medium">Create Account</h2>
          <p className="text-xs text-purple-300/60 mt-1.5">Begin your journey of self-discovery</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full mb-5 bg-[#1e1738]/80 hover:bg-[#251d47] text-white border border-purple-500/30 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3 text-xs tracking-wide cursor-pointer disabled:opacity-50 shadow-sm"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.3-.9-.5-1.9-.5-3z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-purple-500/20"></div>
          <span className="px-3 text-[10px] uppercase tracking-widest text-purple-300/40 font-semibold">Or with email</span>
          <div className="flex-grow border-t border-purple-500/20"></div>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="space-y-1">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-purple-200/70 ml-1">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400/50"><User className="w-4 h-4" /></span>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1e1738]/60 text-white placeholder-purple-300/30 border border-purple-500/30 focus:border-amber-400/80 rounded-xl text-xs outline-none"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-purple-200/70 ml-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400/50"><Mail className="w-4 h-4" /></span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1e1738]/60 text-white placeholder-purple-300/30 border border-purple-500/30 focus:border-amber-400/80 rounded-xl text-xs outline-none"
                placeholder="example@mail.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-purple-200/70 ml-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400/50"><Lock className="w-4 h-4" /></span>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1e1738]/60 text-white placeholder-purple-300/30 border border-purple-500/30 focus:border-amber-400/80 rounded-xl text-xs outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-purple-200/70 ml-1">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400/50"><Lock className="w-4 h-4" /></span>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1e1738]/60 text-white placeholder-purple-300/30 border border-purple-500/30 focus:border-amber-400/80 rounded-xl text-xs outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full mt-2 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 text-zinc-950 font-bold py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(251,191,36,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-xs text-center text-purple-300/70 mt-5">
          Already have an account? <Link href="/login" className="text-amber-300 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}