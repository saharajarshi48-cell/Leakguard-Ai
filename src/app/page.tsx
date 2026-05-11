'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Mail, Zap, TrendingDown, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

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

        {/* How It Works Section */}
        <div className="mt-32 max-w-5xl w-full mx-auto text-center mb-32 z-10 relative">
          <h2 className="text-4xl font-bold text-white mb-16">How LeakGuard Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--surface-hover)] border border-[var(--primary-glow)] flex items-center justify-center mb-6 text-2xl font-bold text-[var(--primary)]">1</div>
              <h3 className="text-xl font-bold mb-3 text-white">Connect Securely</h3>
              <p className="text-[var(--muted)] max-w-xs">Link your Gmail with strict, read-only access. We only look for receipts and subscriptions.</p>
            </div>
            <div className="flex flex-col items-center mt-8 md:mt-0">
              <div className="w-16 h-16 rounded-2xl bg-[var(--surface-hover)] border border-[var(--primary-glow)] flex items-center justify-center mb-6 text-2xl font-bold text-[var(--primary)]">2</div>
              <h3 className="text-xl font-bold mb-3 text-white">AI Scans Receipts</h3>
              <p className="text-[var(--muted)] max-w-xs">Our AI instantly extracts pricing, renewal dates, and hidden free trials from your inbox.</p>
            </div>
            <div className="flex flex-col items-center mt-8 md:mt-0">
              <div className="w-16 h-16 rounded-2xl bg-[var(--surface-hover)] border border-[var(--primary-glow)] flex items-center justify-center mb-6 text-2xl font-bold text-[var(--primary)]">3</div>
              <h3 className="text-xl font-bold mb-3 text-white">Save Money</h3>
              <p className="text-[var(--muted)] max-w-xs">Review your unified dashboard and cancel the sneaky subscriptions draining your wallet.</p>
            </div>
          </div>
        </div>

        {/* Trust & Security Section */}
        <div className="w-full max-w-5xl mx-auto mb-32 z-10 relative">
          <div className="p-8 md:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-[120px] opacity-10 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm mb-6 font-medium">
                  <Lock className="w-4 h-4" />
                  <span>Bank-Level Security</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Your data is safe, encrypted, and yours alone.</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                    <p className="text-[var(--muted)]"><strong>Read-Only Access:</strong> We can't send, delete, or modify your emails. We only read them to find receipts.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                    <p className="text-[var(--muted)]"><strong>We Don't Read Personal Mail:</strong> Our AI filters strictly for purchase and subscription keywords.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                    <p className="text-[var(--muted)]"><strong>Data Never Sold:</strong> We make money by helping you save, not by selling your information to third parties.</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="w-48 h-48 rounded-full border-4 border-[var(--surface-hover)] bg-[var(--background)] flex items-center justify-center shadow-2xl relative">
                  <div className="absolute inset-0 rounded-full border border-green-500/20 animate-ping opacity-20" />
                  <ShieldCheck className="w-24 h-24 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--border)] bg-black/40 backdrop-blur-md py-12 mt-auto z-10 relative">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[var(--primary)] w-6 h-6" />
            <span className="font-bold text-lg text-white">LeakGuard AI</span>
          </div>
          
          <div className="flex gap-8 text-sm text-[var(--muted)]">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:support@leakguard.ai" className="hover:text-white transition-colors">Contact Support</a>
          </div>
          
          <div className="text-sm text-[var(--muted)]">
            &copy; {new Date().getFullYear()} LeakGuard AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
