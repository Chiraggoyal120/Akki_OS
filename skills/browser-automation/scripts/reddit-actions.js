const { chromium } = require('playwright');

const SESSION = 'C:\\Users\\Lenovo\\.openclaw\\mission-control\\browser-sessions\\reddit';

// SCAN subreddit for pain points
async function scanReddit(subreddits = ['startups', 'SaaS', 'Entrepreneur']) {
  const browser = await chromium.launchPersistentContext(SESSION, {
    headless: true
  });
  
  const page = await browser.newPage();
  const allPosts = [];
  
  for (const sub of subreddits) {
    await page.goto(`https://www.reddit.com/r/${sub}/new/`);
    await page.waitForTimeout(3000);
    
    const posts = await page.$$('[data-testid="post-container"]');
    
    for (const post of posts.slice(0, 10)) {
      const title = await post.$eval('h3', el => el.innerText).catch(() => '');
      const upvotes = await post.$eval(
        '[id*="vote-arrows"]',
        el => el.innerText
      ).catch(() => '0');
      
      if (title) {
        allPosts.push({
          subreddit: sub,
          title,
          upvotes,
          url: `https://reddit.com/r/${sub}`
        });
      }
    }
  }
  
  await browser.close();
  return allPosts;
}

module.exports = { scanReddit };