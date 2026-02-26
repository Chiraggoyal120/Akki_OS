const https = require('https');
const fs = require('fs');

const TOKEN = 'apify_api_4SfGKC50BoH09w1HJGkItZwjCdLf1v3xHffg';
const ACTOR_ID = '6V5kyjMMj3cjsJKJf';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

function httpsPost(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function scanReddit() {
  console.log('🚀 Starting Reddit scan...');

  // Step 1: Run Actor
  const runData = JSON.stringify({
  subreddits: 'SaaS+Entrepreneur+startups',
  searchPhrases: 'content marketing+personal branding+burnout',
  maxItems: 50
});

  const runOptions = {
    hostname: 'api.apify.com',
    path: `/v2/acts/${ACTOR_ID}/runs?token=${TOKEN}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': runData.length
    }
  };

  console.log('⏳ Running Apify actor...');
  const runResult = await httpsPost(runOptions, runData);
  const runId = runResult.data.id;
  const datasetId = runResult.data.defaultDatasetId;
  
  console.log(`✅ Run started: ${runId}`);
  console.log(`📦 Dataset: ${datasetId}`);

  // Step 2: Wait for completion
  console.log('⏳ Waiting for results (30 sec)...');
  await new Promise(r => setTimeout(r, 30000));

  // Step 3: Fetch results using auto dataset ID
  console.log('📥 Fetching results...');
  const items = await httpsGet(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${TOKEN}&format=json`
  );

  console.log(`✅ Found ${items.length} posts`);

  // Step 4: Save to memory
  const painPoints = {
    last_updated: new Date().toISOString(),
    total: items.length,
    pain_points: items.map(r => ({
      text: r.title || r.heading || '',
      content: r.body || r.text || '',
      upvotes: r.upVotes || r.score || 0,
      source: r.url || '',
      subreddit: r.communityName || r.subreddit || '',
      frequency: 1,
      trend: 'new'
    }))
  };

  fs.writeFileSync(
    'C:\\Users\\Lenovo\\.openclaw\\workspace\\memory\\graph\\nodes\\PainPoints.json',
    JSON.stringify(painPoints, null, 2)
  );

  console.log('💾 Saved to PainPoints.json!');
  console.log('\nTop 5 Posts:');
  items.slice(0, 5).forEach(r => {
    console.log(`- ${r.title || r.heading} (${r.upVotes || r.score || 0} upvotes)`);
  });
}

scanReddit().catch(console.error);