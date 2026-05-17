import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import rateLimit, { getClientIp } from '@/lib/rate-limit';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const limiter = rateLimit({
  interval: 60000, // 60 seconds
  uniqueTokenPerInterval: 500,
});

const analyzeSchema = z.object({
  userId: z.string().uuid("Invalid User ID format").optional().or(z.literal('')),
  emails: z.array(
    z.object({
      subject: z.string().max(500, "Subject too long"),
      from: z.string().max(255, "Sender too long"),
      date: z.string().max(100, "Date string too long"),
      snippet: z.string().max(5000, "Snippet too long"),
    }).strict() // Rejects unexpected fields
  ).max(20, "Too many emails to analyze at once"),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    try {
      await limiter.check(10, ip); // 10 requests per minute per IP
    } catch {
      const headers = new Headers();
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set('Retry-After', '60');
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429, headers });
    }

    const authHeader = request.headers.get('Authorization');
    const body = await request.json();
    
    // Validate request body using Zod
    const result = analyzeSchema.safeParse(body);
    if (!result.success) {
      const headers = new Headers();
      headers.set("Access-Control-Allow-Origin", "*");
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400, headers });
    }

    const { emails, userId } = result.data;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from environment variables.");
    }

    // 1. Send email contents to Gemini for extraction
    const prompt = `
    You are LeakGuard AI, a financial assistant.
    Analyze the following emails and extract active subscriptions, recurring payments, and free trials.
    
    Output exactly in this JSON structure:
    {
      "subscriptions": [
        { 
          "name": "string (e.g. Netflix)", 
          "category": "string (e.g. Entertainment)", 
          "monthly_cost": number (e.g. 14.99, calculate monthly equivalent if yearly), 
          "yearly_cost": number (calculate yearly equivalent), 
          "renewal_date": "YYYY-MM-DD" (guess from date or leave null), 
          "is_free_trial": boolean,
          "is_active": boolean
        }
      ],
      "leak_score": number (0-100, where 100 means no leaks, and lower means they are paying for redundant/trial things),
      "insights": [
        { "type": "warning" | "alert" | "suggestion", "text": "string (short, conversational advice)" }
      ]
    }
    
    Emails:
    ${JSON.stringify(emails)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });

    const parsedData = JSON.parse(response.text || '{}');

    // 2. Save data to Supabase
    if (userId && authHeader) {
      // Initialize Supabase client with the user's JWT so it passes RLS
      const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
      });

      // Clear old subscriptions (for MVP simplicity, we just replace them)
      await supabaseAuthClient.from('subscriptions').delete().eq('user_id', userId);

      if (parsedData.subscriptions && parsedData.subscriptions.length > 0) {
        const { error: subError } = await supabaseAuthClient
          .from('subscriptions')
          .insert(
            parsedData.subscriptions.map((sub: any) => ({ ...sub, user_id: userId }))
          );
        if (subError) console.error("Supabase Sub Insert Error:", subError);
      }
      
      const { error: scoreError } = await supabaseAuthClient
        .from('leak_scores')
        .upsert({ 
          user_id: userId, 
          score: parsedData.leak_score || 100, 
          insights: parsedData.insights || []
        }, { onConflict: 'user_id' });
        
      if (scoreError) console.error("Supabase Score Upsert Error:", scoreError);
    }

    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return NextResponse.json({ success: true, data: parsedData }, { headers });

  } catch (error: any) {
    console.error('Error analyzing subscriptions:', error);
    
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    return NextResponse.json({ error: error.message }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new NextResponse(null, { status: 204, headers });
}
