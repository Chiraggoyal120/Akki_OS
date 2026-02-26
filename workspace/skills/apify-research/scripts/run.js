const TOKEN = process.env.APIFY_TOKEN || 'apify_api_4SfGKC50BoH09w1HJGkItZwjCdLf1v3xHffg';
const ACTOR_ID = '6V5kyjMMj3cjsJKJf';
async function research(query) {
  const res = await fetch(`https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${TOKEN}`,
    { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({query}) });
  const data = await res.json();
  console.log('✅ Research started:', data.data?.id);
}
research(process.argv[2] || 'SaaS pain points');
