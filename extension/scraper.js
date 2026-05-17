// scraper.js
// Injected into mail.google.com when the user clicks 'Scan'

(function scrapeGmail() {
  const emails = [];
  
  // Strategy 1: Gmail List View
  const rows = document.querySelectorAll('tr.zA');
  
  if (rows.length > 0) {
    rows.forEach(row => {
      const sender = row.querySelector('.yP, .zF')?.textContent || '';
      const subject = row.querySelector('.bog')?.textContent || '';
      const snippet = row.querySelector('.y2')?.textContent || '';
      const date = row.querySelector('td.xW span')?.title || row.querySelector('td.xW span')?.textContent || '';
      
      if (subject || snippet) {
        emails.push({
          from: sender.trim(),
          subject: subject.trim(),
          snippet: snippet.trim(),
          date: date.trim()
        });
      }
    });
  } else {
    // Strategy 2: Open Email View
    const openEmailHeaders = document.querySelectorAll('h2.hP');
    if (openEmailHeaders.length > 0) {
      const subject = openEmailHeaders[0].textContent;
      const senderElement = document.querySelector('.gD');
      const sender = senderElement ? senderElement.getAttribute('email') || senderElement.textContent : '';
      
      // Get the body text of the expanded email
      const bodyElements = document.querySelectorAll('.a3s');
      let bodyText = '';
      if (bodyElements.length > 0) {
        // Just take the first visible one to avoid huge payloads
        bodyText = bodyElements[0].innerText.substring(0, 3000); 
      }
      
      emails.push({
        from: sender,
        subject: subject,
        snippet: bodyText,
        date: new Date().toISOString()
      });
    }
  }

  // Deduplicate and clean
  const uniqueEmails = Array.from(new Set(emails.map(e => JSON.stringify(e))))
    .map(e => JSON.parse(e))
    .filter(e => e.subject.length > 0 || e.snippet.length > 0)
    .slice(0, 50); // Cap at 50 to avoid payload too large

  return uniqueEmails;
})();
