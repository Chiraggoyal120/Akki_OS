const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/home/ubuntu/.openclaw/workspace/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setupTables() {
  console.log('Creating tables...');

  await supabase.rpc('query', { query: `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      telegram_id TEXT UNIQUE,
      name TEXT,
      profile JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS drafts (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      content TEXT,
      platform TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS memory (
      id SERIAL PRIMARY KEY,
      agent TEXT,
      user_id TEXT,
      data JSONB,
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS activity (
      id SERIAL PRIMARY KEY,
      agent TEXT,
      action TEXT,
      message TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `});

  console.log('✅ Tables created!');
}

setupTables();
