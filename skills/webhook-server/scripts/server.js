const http = require('http');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://suijopdxzpwqlheyxqdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aWpvcGR4enB3cWxoZXl4cWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY1NDYyMiwiZXhwIjoyMDg3MjMwNjIyfQ.-Zws-y7D3n7pVtrkg-UVtJxJ-Ar7M0quIgfhzEQZPms'
);

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        console.log('Received:', data);
        
        const result = await supabase.from('activity').insert({
          agent: data.agent || 'main',
          action: data.action || 'message',
          message: data.message || body,
          user_id: data.user_id || null
        });
        
        console.log('Supabase result:', JSON.stringify(result));
        
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
