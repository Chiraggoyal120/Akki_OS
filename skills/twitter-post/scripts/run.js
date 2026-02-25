const { chromium } = require('playwright');
const path = require('path');

async function postTwitter(content) {
  const SESSION = path.join(process.env.HOME, '.openclaw/mission-control/browser-sessions/twitter');
  const browser = await chromium.launchPersistentContext(SESSION, { headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://x.com/home');
  await page.click('[data-testid="tweetTextarea_0"]');
  await page.fill('[data-testid="tweetTextarea_0"]', content);
  await page.click('[data-testid="tweetButtonInline"]');
  
  console.log('✅ Posted on Twitter/X!');
  await browser.close();
}

postTwitter(process.argv[2] || 'Test tweet');
