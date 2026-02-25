const https = require('https');

const TOKEN = 'apify_api_4SfGKC50BoH09w1HJGkItZwjCdLf1v3xHffg';
const ACTOR_ID = '6V5kyjMMj3cjsJKJf';

const data = JSON.stringify({
  subreddits: ['SaaS', 'Entrepreneur', 'startups'],
  searchPhrases: ['content marketing', 'personal branding', 'burnout'],
  maxItems: 50
});

const options = {
  hostname: 'api.apify.com',
  path: `/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${TOKEN}&timeout=60`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🔍 Starting Reddit scan...');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const results = JSON.parse(body);
    console.log(`✅ Found ${results.length} posts`);
    
    // Save to memory
    const fs = require('fs');
    fs.writeFileSync(
      'C:\\Users\\Lenovo\\.openclaw\\workspace\\memory\\graph\\nodes\\PainPoints.json',
      JSON.stringify({
        last_updated: new Date().toISOString(),
        pain_points: results.map(r => ({
          text: r.title,
          content: r.text,
          upvotes: r.upVotes,
          source: r.url,
          subreddit: r.communityName,
          frequency: 1,
          trend: 'new'
        }))
      }, null, 2)
    );
    
    console.log('💾 Saved to PainPoints.json');
    console.log('\nTop 5 Posts:');
    results.slice(0, 5).forEach(r => {
      console.log(`- ${r.title} (${r.upVotes} upvotes)`);
    });
  });
});

req.on('error', (e) => console.log('ERROR:', e.message));
req.write(data);
req.end();