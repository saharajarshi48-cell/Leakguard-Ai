import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const { emails, userId } = await request.json();

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json({ error: 'Valid emails array is required' }, { status: 400 });
    }

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

    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: any) {
    console.error('Error analyzing subscriptions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
