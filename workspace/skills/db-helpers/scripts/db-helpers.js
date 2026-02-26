const supabase = require('./supabase-client');

// User save/get
async function saveUser(telegramId, profile) {
  const { data, error } = await supabase
    .from('users')
    .upsert({ telegram_id: telegramId, profile: profile, id: telegramId })
    .select();
  if (error) console.error('saveUser error:', error);
  return data;
}

async function getUser(telegramId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();
  if (error) return null;
  return data;
}

// Draft save/get
async function saveDraft(userId, content, platform) {
  const { data, error } = await supabase
    .from('drafts')
    .insert({ user_id: userId, content: content, platform: platform })
    .select();
  if (error) console.error('saveDraft error:', error);
  return data;
}

async function getDrafts(userId) {
  const { data, error } = await supabase
    .from('drafts')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending');
  if (error) return [];
  return data;
}

// Activity log
async function logActivity(agent, action, message) {
  const { error } = await supabase
    .from('activity')
    .insert({ agent: agent, action: action, message: message });
  if (error) console.error('logActivity error:', JSON.stringify(error));
}

module.exports = { saveUser, getUser, saveDraft, getDrafts, logActivity };
