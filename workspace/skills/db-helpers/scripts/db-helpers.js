const { ConvexHttpClient } = require('convex/browser');

function getConvex() {
  const url = process.env.CONVEX_URL;
  if (!url) {
    console.log('CONVEX_URL not set - using webhook fallback');
    return null;
  }
  return new ConvexHttpClient(url);
}

async function logActivity(agent, action, message, user_id = null) {
  try {
    await fetch('http://localhost:3003', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent, action, message, user_id })
    });
  } catch(e) {
    console.error('Webhook error:', e.message);
  }
}

async function saveDraft(agent, content, platform, user_id = null) {
  await logActivity(agent, 'draft', JSON.stringify({ content, platform }), user_id);
}

async function saveConfig(key, value) {
  await fetch('http://localhost:3003', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'config_update', key, value })
  });
}

module.exports = { logActivity, saveDraft, saveConfig };
