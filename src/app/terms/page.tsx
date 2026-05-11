'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function TermsOfServicePage() {
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
          <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
          <p className="text-[var(--muted)] mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-[var(--foreground)]">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using LeakGuard AI, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="leading-relaxed">
                LeakGuard AI provides a tool to analyze your email receipts and identify active subscriptions and recurring payments. The service connects to your Gmail account using Google's OAuth infrastructure and processes relevant emails using artificial intelligence.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
              <p className="leading-relaxed">
                You must provide accurate information when connecting your accounts. You are responsible for maintaining the confidentiality of your login credentials and for any activities that occur under your account. You agree not to use the service for any illegal or unauthorized purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Limitation of Liability</h2>
              <p className="leading-relaxed">
                LeakGuard AI provides financial estimates based on AI analysis of your emails. We are not a financial institution, and the data provided is for informational purposes only. We are not liable for any financial losses, missed cancellations, or inaccuracies in the AI-generated reports.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Modifications to Service</h2>
              <p className="leading-relaxed">
                We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice. You agree that LeakGuard AI shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Information</h2>
              <p className="leading-relaxed">
                If you have any questions or concerns regarding these Terms of Service, please contact us at <code>support@leakguard.ai</code>.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
