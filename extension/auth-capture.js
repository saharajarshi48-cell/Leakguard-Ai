// auth-capture.js
// Runs on the dashboard to capture the Supabase session token

function captureToken() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('-auth-token')) {
        const tokenStr = localStorage.getItem(key);
        if (tokenStr) {
          const session = JSON.parse(tokenStr);
          if (session && session.access_token && session.user && session.user.id) {
            chrome.storage.local.set({
              lg_auth_token: session.access_token,
              lg_user_id: session.user.id
            }, () => {
              console.log("LeakGuard Extension: Auth token captured successfully.");
            });
            return true;
          }
        }
      }
    }
  } catch (e) {
    console.error("LeakGuard Extension: Failed to capture token", e);
  }
  return false;
}

// Attempt capture immediately
if (!captureToken()) {
  // If not found, listen for changes (user logs in)
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.includes('-auth-token')) {
      captureToken();
    }
  });
}
