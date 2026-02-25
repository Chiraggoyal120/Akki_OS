const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/home/ubuntu/.openclaw/workspace/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;
