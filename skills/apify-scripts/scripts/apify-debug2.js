const https = require('https');

const TOKEN = 'apify_api_4SfGKC50BoH09w1HJGkItZwjCdLf1v3xHffg';
const ACTOR_ID = '6V5kyjMMj3cjsJKJf';

const data = JSON.stringify({
  subreddits: ['SaaS'],
  maxItems: 3
});

const options = {
  hostname: 'api.apify.com',
  path: `/v2/acts/${ACTOR_ID}/runs?token=${TOKEN}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('FULL RESPONSE:');
    console.log(body.substring(0, 800));
  });
});

req.on('error', e => console.log('ERROR:', e.message));
req.write(data);
req.end();