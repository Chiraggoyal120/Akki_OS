const { chromium } = require('playwright');

async function setupReddit() {
  console.log('🤖 Opening Reddit...');
  
  const browser = await chromium.launchPersistentContext(
    'C:\\Users\\Lenovo\\.openclaw\\mission-control\\browser-sessions\\reddit',
    { headless: false, viewport: { width: 1280, height: 720 } }
  );
  
  const page = await browser.newPage();
  await page.goto('https://www.reddit.com/login');
  
  console.log('👤 Login to Reddit manually');
  console.log('✅ After login, press ENTER here...');
  
  await new Promise(resolve => process.stdin.once('data', resolve));
  
  console.log('✅ Reddit session saved!');
  await browser.close();
  console.log('🎉 Done! Reddit ready for automation.');
}

setupReddit();