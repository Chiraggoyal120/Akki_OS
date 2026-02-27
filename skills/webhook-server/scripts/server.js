require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Supabase client - lazy init after credentials collected
let supabase = null;
function getSupabase() {
  if (!supabase && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return supabase;
}

// Mission Control .env path
const MC_ENV_PATH = path.join(__dirname, '../../../mission_control/.env');
const AKKI_ENV_PATH = path.join(__dirname, '../../../.env');

// Update a key in any .env file
function updateEnvFile(filePath, key, value) {
  try {
    let env = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(env)) {
      env = env.replace(regex, `${key}=${value}`);
    } else {
      env += `\n${key}=${value}`;
    }
    fs.writeFileSync(filePath, env);
    console.log(`Updated ${key} in ${filePath}`);
    return true;
  } catch(e) {
    console.log(`Error updating ${filePath}:`, e.message);
    return false;
  }
}

// Forward to Mission Control
const MISSION_CONTROL_URL = 'http://localhost:8000/api/v1/activity';
async function forwardToMissionControl(data) {
  try {
    const token = process.env.OPENCLAW_TOKEN || process.env.MISSION_CONTROL_TOKEN;
    const response = await fetch(MISSION_CONTROL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    console.log('Mission Control:', response.status);
  } catch(e) {
    console.log('Mission Control error:', e.message);
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        console.log('Received:', data);

        // Handle config_update from agent
        if (data.action === 'config_update') {
          const key = data.key;
          const value = data.value;

          // Update Akki OS .env
          updateEnvFile(AKKI_ENV_PATH, key, value);
          process.env[key] = value;

          // Update Mission Control .env
          if (fs.existsSync(MC_ENV_PATH)) {
            updateEnvFile(MC_ENV_PATH, key, value);

            // Restart Mission Control docker if Supabase credentials updated
            if (key === 'SUPABASE_URL' || key === 'SUPABASE_SERVICE_KEY') {
              console.log('Restarting Mission Control...');
              try {
                execSync('docker compose -f ' + path.join(__dirname, '../../../mission_control/compose.yml') + ' --env-file ' + MC_ENV_PATH + ' up -d', { stdio: 'inherit' });
                console.log('Mission Control restarted!');
              } catch(e) {
                console.log('Docker restart error:', e.message);
              }
            }
          }

          res.writeHead(200);
          res.end(JSON.stringify({ success: true, key }));
          return;
        }

        // Normal activity log
        const sb = getSupabase();
        if (sb) {
          await sb.from('activity').insert({
            agent: data.agent || 'main',
            action: data.action || 'message',
            message: data.message || body,
            user_id: data.user_id || null
          });
        }

        await forwardToMissionControl(data);

        res.writeHead(200);
        res.end('OK');
      } catch(e) {
        console.log('Error:', e.message);
        res.writeHead(500);
        res.end(e.message);
      }
    });
  } else {
    res.writeHead(200);
    res.end('Webhook server running');
  }
});

server.listen(3003, () => {
  console.log('Webhook server on port 3003');
});
