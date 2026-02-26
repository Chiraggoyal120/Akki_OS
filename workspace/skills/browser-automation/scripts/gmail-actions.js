const { google } = require('googleapis');
const fs = require('fs');

const CREDENTIALS = 'C:\\Users\\Lenovo\\.openclaw\\mission-control\\credentials\\google-credentials.json';
const TOKEN = 'C:\\Users\\Lenovo\\.openclaw\\mission-control\\credentials\\google-token.json';

function getAuth() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const token = JSON.parse(fs.readFileSync(TOKEN));
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

// GET recent emails
async function getEmails(maxResults = 10) {
  const auth = getAuth();
  const gmail = google.gmail({ version: 'v1', auth });
  
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults,
    q: 'is:unread'
  });
  
  const messages = response.data.messages || [];
  const emails = [];
  
  for (const msg of messages.slice(0, 5)) {
    const detail = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id
    });
    
    const headers = detail.data.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value;
    const from = headers.find(h => h.name === 'From')?.value;
    const date = headers.find(h => h.name === 'Date')?.value;
    
    emails.push({ subject, from, date, id: msg.id });
  }
  
  return emails;
}

// GET today's calendar events
async function getCalendarEvents() {
  const auth = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });
  
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59);
  
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: now.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: true,
    orderBy: 'startTime'
  });
  
  return response.data.items.map(event => ({
    title: event.summary,
    time: event.start.dateTime || event.start.date,
    link: event.hangoutLink || null // Google Meet link
  }));
}

// SEND email
async function sendEmail(to, subject, body) {
  const auth = getAuth();
  const gmail = google.gmail({ version: 'v1', auth });
  
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    body
  ].join('\n');
  
  const encoded = Buffer.from(message).toString('base64');
  
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encoded }
  });
  
  console.log('✅ Email sent!');
}

module.exports = { getEmails, getCalendarEvents, sendEmail };