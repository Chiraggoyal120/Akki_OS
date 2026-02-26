const { chromium } = require('playwright');

const SESSION = 'C:\\Users\\Lenovo\\.openclaw\\mission-control\\browser-sessions\\twitter';

// POST tweet
async function postTweet(text) {
  const browser = await chromium.launchPersistentContext(SESSION, {
    headless: false
  });
  
  const page = await browser.newPage();
  await page.goto('https://twitter.com/compose/tweet');
  await page.waitForTimeout(3000);
  
  await page.fill('[data-testid="tweetTextarea_0"]', text);
  await page.waitForTimeout(1000);
  
  await page.click('[data-testid="tweetButtonInline"]');
  await page.waitForTimeout(3000);
  
  await browser.close();
  console.log('✅ Tweeted!');
}

// SEARCH and engage
async function searchAndEngage(query, limit = 5) {
  const browser = await chromium.launchPersistentContext(SESSION, {
    headless: true
  });
  
  const page = await browser.newPage();
  await page.goto(`https://twitter.com/search?q=${encodeURIComponent(query)}&f=live`);
  await page.waitForTimeout(3000);
  
  const tweets = await page.$$('[data-testid="tweet"]');
  let liked = 0;
  
  for (const tweet of tweets.slice(0, limit)) {
    const likeBtn = await tweet.$('[data-testid="like"]');
    if (likeBtn) {
      await likeBtn.click();
      liked++;
      await page.waitForTimeout(1500);
    }
  }
  
  await browser.close();
  return { liked };
}

module.exports = { postTweet, searchAndEngage };