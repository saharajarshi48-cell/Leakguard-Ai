// scraper.js
// Injected into mail.google.com when the user clicks 'Scan'

(function scrapeGmail() {
  const KEYWORDS = [
    'subscription', 'renewal', 'invoice', 'payment', 'charged', 
    'trial', 'membership', 'receipt', 'billing', 'premium', 
    'monthly', 'annual'
  ];

  const BRANDS = [
    'netflix', 'spotify', 'canva', 'adobe', 'chatgpt', 'notion', 
    'figma', 'amazon prime', 'youtube premium', 'google one', 
    'apple', 'microsoft'
  ];

  const isRelevant = (text) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    const hasKeyword = KEYWORDS.some(kw => lower.includes(kw));
    const hasBrand = BRANDS.some(brand => lower.includes(brand));
    return hasKeyword || hasBrand;
  };

  const emails = [];
  
  // Strategy 1: Gmail List View
  const rows = document.querySelectorAll('tr.zA');
  
  if (rows.length > 0) {
    rows.forEach(row => {
      const sender = row.querySelector('.yP, .zF')?.textContent || '';
      const subject = row.querySelector('.bog')?.textContent || '';
      const snippet = row.querySelector('.y2')?.textContent || '';
      const date = row.querySelector('td.xW span')?.title || row.querySelector('td.xW span')?.textContent || '';
      
      const fullText = `${sender} ${subject} ${snippet}`;
      
      if (isRelevant(fullText)) {
        emails.push({
          from: sender.trim().substring(0, 255),
          subject: subject.trim().substring(0, 500),
          snippet: snippet.trim().substring(0, 1000), // Limit snippet to save payload size
          date: date.trim().substring(0, 100)
        });
      }
    });
  } else {
    // Strategy 2: Open Email View
    const openEmailHeaders = document.querySelectorAll('h2.hP');
    if (openEmailHeaders.length > 0) {
      const subject = openEmailHeaders[0].textContent || '';
      const senderElement = document.querySelector('.gD');
      const sender = senderElement ? senderElement.getAttribute('email') || senderElement.textContent : '';
      
      // Get the body text of the expanded email
      const bodyElements = document.querySelectorAll('.a3s');
      let bodyText = '';
      if (bodyElements.length > 0) {
        bodyText = bodyElements[0].innerText;
      }
      
      const fullText = `${sender} ${subject} ${bodyText}`;
      
      if (isRelevant(fullText)) {
        emails.push({
          from: sender.substring(0, 255),
          subject: subject.substring(0, 500),
          snippet: bodyText.substring(0, 1000), // Severely limit body to act as a snippet
          date: new Date().toISOString()
        });
      }
    }
  }

  // Deduplicate and clean
  const uniqueEmails = Array.from(new Set(emails.map(e => JSON.stringify(e))))
    .map(e => JSON.parse(e))
    .slice(0, 50); // Cap max raw emails found before batching

  return uniqueEmails;
})();
