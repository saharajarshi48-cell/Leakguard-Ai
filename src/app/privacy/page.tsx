'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] p-6 md:p-12 relative overflow-hidden">
      <div className="animated-bg" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-[0_0_20px_rgba(45,104,255,0.4)]">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">LeakGuard AI</span>
          </Link>
          <Button href="/" variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </div>

        <Card glass className="p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-[var(--muted)] mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-[var(--foreground)]">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                Welcome to LeakGuard AI. We are committed to protecting your privacy and ensuring your data is handled securely. This Privacy Policy explains how we collect, use, and safeguard your information, particularly regarding our integration with Google APIs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Data We Collect and How We Use It</h2>
              <p className="leading-relaxed mb-4">
                When you connect your Google account, we request the <strong>Read-Only Gmail Scope</strong> (<code>https://www.googleapis.com/auth/gmail.readonly</code>). We use this permission strictly to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-[var(--muted)]">
                <li>Search for emails categorized as purchases, receipts, or free trials.</li>
                <li>Extract subscription names, costs, and renewal dates using AI.</li>
                <li>Calculate your total monthly and yearly spending.</li>
              </ul>
              <p className="leading-relaxed font-medium text-white p-4 rounded-xl border border-[var(--primary-glow)] bg-[var(--surface-hover)]">
                <strong>Important:</strong> We do NOT read your personal, non-financial emails. Your emails are never permanently stored in our database. We only store the extracted metadata (e.g., "Netflix - $15.99/mo").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. AI Processing</h2>
              <p className="leading-relaxed">
                We use advanced AI models (Google Gemini) to analyze email snippets. The data sent to the AI is strictly limited to emails matching purchase or subscription keywords. We do not use your email data to train public AI models.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Sharing and Sales</h2>
              <p className="leading-relaxed">
                <strong>We never sell your data.</strong> Your extracted subscription data is yours alone. We do not share your information with advertisers, third-party marketers, or any unauthorized entities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Security</h2>
              <p className="leading-relaxed">
                Your data is protected using industry-standard encryption (HTTPS/TLS in transit, and encrypted at rest in our Supabase database). We use Row Level Security (RLS) to ensure that only you can access your subscription data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy or wish to request the deletion of your account and data, please contact us at <code>support@leakguard.ai</code>.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
