'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Timeline, TimelineItem } from '@/components/ui/Timeline';
import { ShieldCheck, LogOut, Bell, Settings, CreditCard, Sparkles, TrendingUp, AlertTriangle, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [leakScore, setLeakScore] = useState<number>(100);
  const [insights, setInsights] = useState<any[]>([]);
  
  const [scanningState, setScanningState] = useState<'idle' | 'connecting' | 'scanning' | 'analyzing'>('idle');
  const [hasScanned, setHasScanned] = useState(false);

  useEffect(() => {
    setHasScanned(!!sessionStorage.getItem('hasScanned'));
  }, []);

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      // 1. Check Authentication
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      
      if (!activeSession) {
        router.push('/auth');
        return;
      }
      
      setUser(activeSession.user);
      setSession(activeSession);

      // 2. Fetch Data
      const [subsResponse, scoreResponse] = await Promise.all([
        supabase.from('subscriptions').select('*').eq('user_id', activeSession.user.id),
        supabase.from('leak_scores').select('*').eq('user_id', activeSession.user.id).single()
      ]);

      let hasSubs = false;
      if (subsResponse.data && subsResponse.data.length > 0) {
        setSubscriptions(subsResponse.data);
        hasSubs = true;
      }

      if (scoreResponse.data) {
        setLeakScore(scoreResponse.data.score);
        setInsights(scoreResponse.data.insights || []);
      } else {
        setLeakScore(100);
      }

      setLoading(false);

      // 3. Set up real-time listener for new subscriptions from extension
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'subscriptions',
            filter: `user_id=eq.${activeSession.user.id}`
          },
          (payload) => {
            console.log('Real-time update received:', payload);
            // Refresh data when extension pushes new subs
            supabase.from('subscriptions').select('*').eq('user_id', activeSession.user.id)
              .then(({ data }) => {
                if (data && data.length > 0) setSubscriptions(data);
              });
            supabase.from('leak_scores').select('*').eq('user_id', activeSession.user.id).single()
              .then(({ data }) => {
                if (data) {
                  setLeakScore(data.score);
                  setInsights(data.insights || []);
                }
              });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    checkUserAndFetchData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  const totalSpend = subscriptions
    .filter(s => s.is_active && !s.is_free_trial)
    .reduce((sum, s) => sum + Number(s.monthly_cost), 0);
    
  const yearlyEstimate = totalSpend * 12;

  const chartData = [
    { month: 'Dec', spend: totalSpend * 0.85 },
    { month: 'Jan', spend: totalSpend * 0.9 },
    { month: 'Feb', spend: totalSpend * 0.95 },
    { month: 'Mar', spend: totalSpend * 0.92 },
    { month: 'Apr', spend: totalSpend },
    { month: 'May', spend: totalSpend * 1.05 },
  ];

  const timelineItems: TimelineItem[] = subscriptions.slice(0, 5).map((sub, idx) => ({
    id: sub.id,
    title: sub.name,
    date: sub.renewal_date || `In ${idx + 2} days`,
    amount: sub.monthly_cost,
    icon: <CreditCard className="w-5 h-5" />,
    isActive: idx === 0
  }));

  const isEmpty = subscriptions.length === 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex relative overflow-hidden">
      <div className="animated-bg" />
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[var(--border)] p-6 hidden md:flex flex-col z-10 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded bg-[var(--primary)] flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-white">LeakGuard</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--surface-hover)] text-white font-medium">
            <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--muted)] hover:bg-[var(--surface)] hover:text-white transition-colors">
            <CreditCard className="w-5 h-5" />
            Subscriptions
          </a>
        </nav>

        <div className="mt-auto">
          <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start gap-2 text-[var(--muted)] hover:text-white">
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-[var(--muted)]">{user?.email}</p>
          </div>
          <Button variant="outline" className="gap-2 hidden sm:flex text-white">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            Waiting for Extension...
          </Button>
        </header>

        <AnimatePresence>
          {(scanningState === 'scanning' || scanningState === 'analyzing') && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--surface)] border border-[var(--primary-glow)] rounded-full px-6 py-3 flex items-center gap-3 shadow-[0_0_30px_var(--primary-glow)]"
            >
              <Loader2 className="w-5 h-5 text-[var(--primary)] animate-spin" />
              <span className="text-white font-medium">
                {scanningState === 'scanning' ? "Scanning latest emails..." : "AI analyzing subscriptions..."}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {isEmpty ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center relative overflow-hidden border-[var(--primary-glow)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--primary)] rounded-full blur-[100px] opacity-10 pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface-hover)] flex items-center justify-center mb-6 z-10">
              <Mail className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 z-10">
              Ready to Scan
            </h2>
            <p className="text-[var(--muted)] max-w-md mb-8 z-10">
              Your dashboard is waiting for data. To begin, install the LeakGuard AI Browser Extension, open your Gmail, and click "Scan".
            </p>
            <div className="flex gap-4 z-10">
              <Button size="lg" className="gap-2" onClick={() => window.open('/leakguard-extension.zip', '_blank')}>
                Download Extension
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={() => window.open('https://mail.google.com', '_blank')}>
                Open Gmail
              </Button>
            </div>
          </Card>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="relative z-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Top Level Stats */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="h-full flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] rounded-full blur-[100px] opacity-10 pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8 z-10 w-full h-full">
                    <div className="flex-1 w-full">
                      <p className="text-[var(--muted)] font-medium mb-2">Total Monthly Spend</p>
                      <h2 className="text-5xl font-extrabold text-white mb-2">
                        ₹{totalSpend.toLocaleString()}
                      </h2>
                      <div className="h-24 w-full mt-4 -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Tooltip 
                              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
                              itemStyle={{ color: 'white' }}
                            />
                            <Area type="monotone" dataKey="spend" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <CircularProgress value={leakScore} label="Leak Score" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* AI Insights Panel */}
              <motion.div variants={itemVariants}>
                <Card glass className="flex flex-col h-full border-[var(--primary-glow)]">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                  <h3 className="font-bold text-white">AI Insights</h3>
                </div>
                <div className="space-y-4 flex-1">
                  {insights.length === 0 ? (
                    <p className="text-sm text-[var(--muted)]">No active leaks detected. Your spending is looking good!</p>
                  ) : (
                    insights.map((insight, idx) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />}
                        {insight.type === 'alert' && <Bell className="w-5 h-5 text-[#ff4b4b] shrink-0" />}
                        {insight.type === 'suggestion' && <Sparkles className="w-5 h-5 text-[var(--accent)] shrink-0" />}
                        <p className="text-[var(--foreground)]">{insight.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Subscriptions */}
              <motion.div variants={itemVariants}>
                <Card className="h-full">
                <h3 className="font-bold text-white mb-6">Active Subscriptions</h3>
                <div className="space-y-4">
                  {subscriptions.map((sub, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl hover:bg-[var(--surface-hover)] transition-colors border border-transparent hover:border-[var(--border)]">
                      <div>
                        <p className="font-medium text-white flex items-center gap-2">
                          {sub.name}
                          {sub.is_free_trial && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Trial</span>}
                        </p>
                        <p className="text-xs text-[var(--muted)]">{sub.category}</p>
                      </div>
                      <p className="font-bold">₹{sub.monthly_cost}/mo</p>
                    </div>
                  ))}
                </div>
                {subscriptions.length > 5 && (
                  <Button variant="ghost" className="w-full mt-4 text-[var(--primary)] hover:text-white">View All Subscriptions</Button>
                )}
                </Card>
              </motion.div>

              {/* Upcoming Renewals Timeline */}
              <motion.div variants={itemVariants}>
                <Card className="h-full">
                  <h3 className="font-bold text-white mb-6">Upcoming Charges</h3>
                  <Timeline items={timelineItems} />
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

