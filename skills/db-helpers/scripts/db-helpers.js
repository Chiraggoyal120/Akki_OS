const { ConvexHttpClient } = require('convex/browser');
const { api } = require('../../../convex/_generated/api');

const convex = new ConvexHttpClient('https://graceful-clownfish-349.convex.cloud');

async function logActivity(agent, action, message, user_id = null) {
  try {
    await convex.mutation(api.activity.log, { agent, action, message, user_id });
    console.log('Activity logged to Convex');
  } catch(e) {
    console.error('Convex error:', e.message);
    // Fallback to webhook
    await fetch('http://localhost:3003', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent, action, message, user_id })
    });
  }
}

async function saveDraft(agent, content, platform, user_id = null) {
  try {
    await convex.mutation(api.activity.log, {
      agent,
      action: 'draft',
      message: JSON.stringify({ content, platform }),
      user_id
    });
    console.log('Draft saved to Convex');
  } catch(e) {
    console.error('Convex error:', e.message);
  }
}

async function saveConfig(key, value) {
  try {
    await convex.mutation(api.config.set, { key, value });
    console.log(`Config saved: ${key}`);
  } catch(e) {
    console.error('Convex error:', e.message);
  }
}

module.exports = { logActivity, saveDraft, saveConfig };
