'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Mail, Zap, TrendingDown, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--background)]">
      <div className="animated-bg" />
      
      {/* Navbar */}
      <nav className="w-full p-6 flex justify-between items-center z-10 bg-black/20 backdrop-blur-md border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-[0_0_20px_rgba(45,104,255,0.4)]">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">LeakGuard AI</span>
        </div>
        <div className="flex gap-4">
          <Button href="/auth" variant="ghost" size="sm">Log in</Button>
          <Button href="/auth" variant="primary" size="sm">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--primary-glow)] bg-[var(--surface)] text-[var(--primary)] text-sm mb-8 font-medium">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Subscription Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Your AI that stops <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
              money leaks.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10">
            Detect forgotten subscriptions, free trials, and hidden recurring charges before they drain your wallet. Connect Gmail and let AI do the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/auth" size="lg" className="w-full sm:w-auto gap-2">
              Scan My Subscriptions <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Abstract Glowing Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)] rounded-full blur-[150px] opacity-10 pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[var(--accent)] rounded-full blur-[150px] opacity-10 pointer-events-none -z-10" />

        {/* Features Section */}
        <div className="mt-32 max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-32">
          <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="w-12 h-12 rounded-xl bg-[var(--surface-hover)] flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Gmail Scanning</h3>
            <p className="text-[var(--muted)]">Automatically detects receipts, invoices, and free trials directly from your inbox securely.</p>
          </div>
          <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="w-12 h-12 rounded-xl bg-[var(--surface-hover)] flex items-center justify-center mb-6">
              <TrendingDown className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">AI Leak Detection</h3>
            <p className="text-[var(--muted)]">Identifies duplicate tools, unused memberships, and overlapping services to save you money.</p>
          </div>
          <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="w-12 h-12 rounded-xl bg-[var(--surface-hover)] flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Free Trial Alerts</h3>
            <p className="text-[var(--muted)]">Get notified before a free trial converts into a paid subscription so you can cancel in time.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
