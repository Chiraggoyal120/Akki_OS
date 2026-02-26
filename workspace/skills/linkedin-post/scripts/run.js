const { chromium } = require('playwright');
const path = require('path');

async function postLinkedIn(content) {
  const SESSION = path.join(process.env.HOME, '.openclaw/mission-control/browser-sessions/linkedin');
  const browser = await chromium.launchPersistentContext(SESSION, { headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.linkedin.com/feed/');
  await page.click('[data-control-name="share.sharebox_text"]');
  await page.fill('.ql-editor', content);
  await page.click('[data-control-name="share.post_btn"]');
  
  console.log('✅ Posted on LinkedIn!');
  await browser.close();
}

postLinkedIn(process.argv[2] || 'Test post');
