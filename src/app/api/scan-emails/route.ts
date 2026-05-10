import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const googleAccessToken = body.access_token;

    if (!googleAccessToken) {
      return NextResponse.json({ error: 'Missing access_token' }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: googleAccessToken });

    try {
      const tokenInfo = await oauth2Client.getTokenInfo(googleAccessToken);
      if (!tokenInfo.scopes || !tokenInfo.scopes.includes('https://www.googleapis.com/auth/gmail.readonly')) {
        return NextResponse.json({ 
          error: 'Missing Gmail permissions. Please sign out, log in again, and check the box to allow access to your emails.' 
        }, { status: 403 });
      }
    } catch (tokenErr) {
      console.error("Token verification failed:", tokenErr);
      // We will continue and let the gmail API call fail if the token is entirely invalid, 
      // but this block helps catch scope issues specifically.
    }

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Search for emails related to subscriptions, receipts, or free trials
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'category:purchases OR "subscription" OR "receipt" OR "free trial"',
      maxResults: 15 // Limit to keep OpenAI costs low for MVP
    });

    const messages = res.data.messages || [];
    const extractedEmails = [];

    for (const message of messages) {
      if (!message.id) continue;
      
      const msgData = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'metadata',
        metadataHeaders: ['Subject', 'Date', 'From']
      });

      const headers = msgData.data.payload?.headers || [];
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
      const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();
      const snippet = msgData.data.snippet || '';

      extractedEmails.push({ subject, from, date, snippet });
    }

    return NextResponse.json({ success: true, emails: extractedEmails });

  } catch (error: any) {
    console.error('Error scanning emails:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
