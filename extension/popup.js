document.addEventListener('DOMContentLoaded', async () => {
  const unauthView = document.getElementById('unauth-view');
  const authView = document.getElementById('auth-view');
  const btnLogin = document.getElementById('btn-login');
  const btnScan = document.getElementById('btn-scan');
  const btnDashboard = document.getElementById('btn-dashboard');
  const scanLoader = document.getElementById('scan-loader');
  const scanText = document.getElementById('scan-text');
  const errorMsg = document.getElementById('error-msg');
  const successMsg = document.getElementById('success-msg');
  const statusHeading = document.getElementById('status-heading');
  const statusDescription = document.getElementById('status-description');

  const API_URL = 'https://www.getleakguard.in';
  let authToken = null;
  let userId = null;

  // Check auth state
  const data = await chrome.storage.local.get(['lg_auth_token', 'lg_user_id']);
  if (data.lg_auth_token && data.lg_user_id) {
    authToken = data.lg_auth_token;
    userId = data.lg_user_id;
    unauthView.style.display = 'none';
    authView.style.display = 'block';
  } else {
    unauthView.style.display = 'block';
    authView.style.display = 'none';
  }

  // Check if we are on Gmail
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isGmail = tab.url && tab.url.includes('mail.google.com');
  
  if (!isGmail && authToken) {
    statusHeading.textContent = "Open Gmail";
    statusDescription.textContent = "Navigate to mail.google.com to scan for subscriptions.";
    btnScan.disabled = true;
    btnScan.style.opacity = '0.5';
  } else if (authToken) {
    statusHeading.textContent = "Ready to Scan";
    statusDescription.textContent = "Click below to scan the emails currently visible on your screen.";
  }

  btnLogin.addEventListener('click', () => {
    chrome.tabs.create({ url: `${API_URL}/dashboard` });
  });

  btnDashboard.addEventListener('click', () => {
    chrome.tabs.create({ url: `${API_URL}/dashboard` });
  });

  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  btnScan.addEventListener('click', async () => {
    if (!isGmail || !authToken) return;

    // UI Loading state
    btnScan.disabled = true;
    scanLoader.style.display = 'inline-block';
    scanText.textContent = 'Finding subscriptions...';
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    try {
      // 1. Inject content script to scrape locally
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['scraper.js']
      });

      const emails = results[0]?.result || [];
      
      if (emails.length === 0) {
        throw new Error("No subscription emails found locally. Try scrolling or opening a billing email.");
      }

      // 2. Batching System (Max 5 emails per request to prevent payload overflow)
      const emailBatches = chunkArray(emails, 5);
      let totalSubscriptionsFound = 0;

      for (let i = 0; i < emailBatches.length; i++) {
        scanText.textContent = `Analyzing recurring payments (Batch ${i + 1}/${emailBatches.length})...`;
        
        const batch = emailBatches[i];
        
        const res = await fetch(`${API_URL}/api/analyze-subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ emails: batch, userId })
        });

        const resData = await res.json();
        
        if (!res.ok || !resData.success) {
          console.warn(`Batch ${i + 1} failed:`, resData.error);
          continue; // Don't fail the whole scan if one batch fails
        }

        totalSubscriptionsFound += (resData.data.subscriptions?.length || 0);
      }

      // Success
      successMsg.textContent = `Success! Processed ${emails.length} emails and found ${totalSubscriptionsFound} subscriptions.`;
      successMsg.style.display = 'block';
      
    } catch (err) {
      errorMsg.textContent = err.message;
      errorMsg.style.display = 'block';
    } finally {
      btnScan.disabled = false;
      scanLoader.style.display = 'none';
      scanText.textContent = 'Scan Visible Emails';
    }
  });
});
