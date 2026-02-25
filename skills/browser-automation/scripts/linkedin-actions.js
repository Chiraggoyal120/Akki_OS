const { chromium } = require('playwright');
const fs = require('fs');

const SESSION = 'C:\\Users\\Lenovo\\.openclaw\\mission-control\\browser-sessions\\linkedin';
const LOG = 'C:\\Users\\Lenovo\\.openclaw\\mission-control\\agents\\atlas\\memory\\engagement-log.md';

// SCROLL & LIKE ICP posts
async function engageLinkedIn(keywords = ['founder', 'startup', 'SaaS']) {
  const browser = await chromium.launchPersistentContext(SESSION, {
    headless: true
  });
  
  const page = await browser.newPage();
  await page.goto('https://www.linkedin.com/feed/');
  await page.waitForTimeout(3000);
  
  let liked = 0, commented = 0;
  
  for (let i = 0; i < 5; i++) {
    const posts = await page.$$('.feed-shared-update-v2');
    
    for (const post of posts.slice(0, 5)) {
      const content = await post.$eval(
        '.feed-shared-text',
        el => el.innerText
      ).catch(() => '');
      
      const isMatch = keywords.some(kw =>
        content.toLowerCase().includes(kw)
      );
      
      if (isMatch) {
        // Like
        const likeBtn = await post.$(
          'button[aria-label*="React"], button[aria-label*="Like"]'
        );
        if (likeBtn) {
          await likeBtn.click();
          liked++;
          await page.waitForTimeout(1000);
        }
      }
    }
    
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(2000);
  }
  
  // Log results
  const log = `\n## ${new Date().toISOString()}\n- Liked: ${liked}\n- Commented: ${commented}\n`;
  fs.appendFileSync(LOG, log);
  
  await browser.close();
  return { liked, commented };
}

// POST to LinkedIn
async function postLinkedIn(text) {
  const browser = await chromium.launchPersistentContext(SESSION, {
    headless: false
  });
  
  const page = await browser.newPage();
  await page.goto('https://www.linkedin.com/feed/');
  await page.waitForTimeout(3000);
  
  // Click "Start a post"
  await page.click('button:has-text("Start a post"), .share-box-feed-entry__trigger');
  await page.waitForTimeout(2000);
  
  // Type post
  await page.fill('.ql-editor, [contenteditable="true"]', text);
  await page.waitForTimeout(1000);
  
  // Click Post button
  await page.click('button:has-text("Post")');
  await page.waitForTimeout(3000);
  
  await browser.close();
  console.log('✅ Posted to LinkedIn!');
}

// SEND connection request
async function connectLinkedIn(profileUrl, note) {
  const browser = await chromium.launchPersistentContext(SESSION, {
    headless: false
  });
  
  const page = await browser.newPage();
  await page.goto(profileUrl);
  await page.waitForTimeout(3000);
  
  await page.click('button:has-text("Connect")');
  await page.waitForTimeout(1000);
  
  if (note) {
    await page.click('button:has-text("Add a note")');
    await page.fill('textarea', note);
  }
  
  await page.click('button:has-text("Send")');
  await browser.close();
  console.log('✅ Connection request sent!');
}

module.exports = { engageLinkedIn, postLinkedIn, connectLinkedIn };