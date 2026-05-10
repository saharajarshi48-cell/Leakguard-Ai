-- LeakGuard AI Database Schema

-- 1. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    monthly_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    yearly_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    renewal_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_free_trial BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Leak Scores Table
CREATE TABLE IF NOT EXISTS public.leak_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    insights JSONB DEFAULT '[]'::jsonb, -- Store array of insight objects
    last_scanned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leak_scores ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for Subscriptions
-- Users can only SELECT their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only INSERT their own subscriptions
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only UPDATE their own subscriptions
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only DELETE their own subscriptions
CREATE POLICY "Users can delete own subscriptions" ON public.subscriptions
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Create RLS Policies for Leak Scores
CREATE POLICY "Users can view own leak score" ON public.leak_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leak score" ON public.leak_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leak score" ON public.leak_scores
    FOR UPDATE USING (auth.uid() = user_id);

-- 6. Functions and Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_leak_scores_updated_at
    BEFORE UPDATE ON public.leak_scores
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
