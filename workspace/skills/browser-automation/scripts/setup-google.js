const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');

const CREDENTIALS_PATH = 'C:\\Users\\Lenovo\\.openclaw\\mission-control\\credentials\\google-credentials.json';
const TOKEN_PATH = 'C:\\Users\\Lenovo\\.openclaw\\mission-control\\credentials\\google-token.json';

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/contacts.readonly'
];

async function setupGoogle() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]
  );
  
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  
  console.log('\n🔗 Open this URL in your browser:\n');
  console.log(authUrl);
  console.log('\n📋 After allowing access, paste the code here:');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  rl.question('\nCode: ', async (code) => {
    rl.close();
    const { tokens } = await oAuth2Client.getToken(code.trim());
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('\n✅ Google (Gmail + Calendar + Meet) connected!');
    
    // Test connection
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    console.log('📧 Gmail connected:', profile.data.emailAddress);
    
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const calList = await calendar.calendarList.list();
    console.log('📅 Calendar connected:', calList.data.items[0].summary);
    
    console.log('\n🎉 Google setup complete!');
  });
}

setupGoogle();