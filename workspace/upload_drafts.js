const fs = require('fs');
const https = require('https');

const draftsFile = 'memory/drafts/linkedin_drafts.json';
const userId = '7fd48e9f-dece-4572-a8a0-b49a78bd7cc0';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aWpvcGR4enB3cWxoZXl4cWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY1NDYyMiwiZXhwIjoyMDg3MjMwNjIyfQ.-Zws-y7D3n7pVtrkg-UVtJxJ-Ar7M0quIgfhzEQZPms';
const url = 'https://suijopdxzpwqlheyxqdp.supabase.co/rest/v1/drafts';

const rawData = fs.readFileSync(draftsFile);
const data = JSON.parse(rawData);

const payloads = data.drafts.map(draft => ({
    content: draft.content,
    platform: 'linkedin',
    status: 'pending',
    user_id: userId
}));

const postData = JSON.stringify(payloads);

const options = {
    hostname: 'suijopdxzpwqlheyxqdp.supabase.co',
    path: '/rest/v1/drafts',
    method: 'POST',
    headers: {
        'apikey': apiKey,
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
