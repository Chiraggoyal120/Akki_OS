const { chromium } = require('playwright');

async function setupTwitter() {
  console.log('🐦 Opening Twitter...');
  
  const browser = await chromium.launchPersistentContext(
    'C:\\Users\\Lenovo\\.openclaw\\mission-control\\browser-sessions\\twitter',
    { headless: false, viewport: { width: 1280, height: 720 } }
  );
  
  const page = await browser.newPage();
  await page.goto('https://twitter.com/login');
  
  console.log('👤 Login to Twitter manually in the browser');
  console.log('✅ After login, press ENTER here...');
  
  await new Promise(resolve => process.stdin.once('data', resolve));
  
  console.log('✅ Twitter session saved!');
  await browser.close();
  console.log('🎉 Done! Twitter ready for automation.');
}

setupTwitter();