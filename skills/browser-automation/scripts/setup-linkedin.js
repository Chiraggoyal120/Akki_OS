const { chromium } = require('playwright');

async function setupLinkedIn() {
  console.log('🔗 Opening LinkedIn...');
  
  const browser = await chromium.launchPersistentContext(
    'C:\\Users\\Lenovo\\.openclaw\\mission-control\\browser-sessions\\linkedin',
    { headless: false, viewport: { width: 1280, height: 720 } }
  );
  
  const page = await browser.newPage();
  await page.goto('https://www.linkedin.com/login');
  
  console.log('👤 Login to LinkedIn manually in the browser');
  console.log('✅ After login is complete, press ENTER here...');
  
  await new Promise(resolve => process.stdin.once('data', resolve));
  
  const title = await page.title();
  if (title.includes('Feed') || title.includes('LinkedIn')) {
    console.log('✅ LinkedIn session saved!');
  }
  
  await browser.close();
  console.log('🎉 Done! LinkedIn ready for automation.');
}

setupLinkedIn();