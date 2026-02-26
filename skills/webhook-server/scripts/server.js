require('dotenv').config();
const http = require('http');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const MISSION_CONTROL_URL = 'http://localhost:8000/api/v1/activity';
const MISSION_CONTROL_TOKEN = process.env.MISSION_CONTROL_TOKEN;

async function forwardToMissionControl(data) {
  try {
    const response = await fetch(MISSION_CONTROL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISSION_CONTROL_TOKEN}`
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
        await supabase.from('activity').insert({
          agent: data.agent || 'main',
          action: data.action || 'message',
          message: data.message || body,
          user_id: data.user_id || null
        });
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