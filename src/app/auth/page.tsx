'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/gmail.readonly',
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      },
    });

    if (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[var(--background)]">
      <div className="animated-bg" />
      
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 z-20">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-[0_0_20px_rgba(45,104,255,0.4)]">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white hidden sm:block">LeakGuard</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card glass className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-[var(--muted)]">Sign in to stop your money leaks.</p>
          </div>

          <div className="space-y-4">
            <Button onClick={handleGoogleLogin} variant="outline" className="w-full flex items-center justify-center gap-3 h-12 bg-white text-black hover:bg-gray-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.72 17.59V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.59C14.73 18.25 13.48 18.66 12 18.66C9.13 18.66 6.7 16.73 5.82 14.13H2.15V16.98C3.96 20.58 7.68 23 12 23Z" fill="#34A853" />
                <path d="M5.82 14.13C5.6 13.46 5.47 12.75 5.47 12C5.47 11.25 5.6 10.54 5.82 9.87V7.02H2.15C1.4 8.52 1 10.21 1 12C1 13.79 1.4 15.48 2.15 16.98L5.82 14.13Z" fill="#FBBC05" />
                <path d="M12 5.34C13.62 5.34 15.07 5.9 16.21 6.99L19.36 3.84C17.45 2.05 14.97 1 12 1C7.68 1 3.96 3.42 2.15 7.02L5.82 9.87C6.7 7.27 9.13 5.34 12 5.34Z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[var(--border)]"></div>
              <span className="flex-shrink-0 mx-4 text-[var(--muted)] text-sm">or</span>
              <div className="flex-grow border-t border-[var(--border)]"></div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Email</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-shadow"
                />
              </div>
              <Button href="/dashboard" className="w-full flex justify-center gap-2">
                <Mail className="w-5 h-5" />
                Continue with Email
              </Button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-[var(--muted)]">
            By continuing, you agree to our <a href="#" className="text-white hover:underline">Terms of Service</a> and <a href="#" className="text-white hover:underline">Privacy Policy</a>.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
