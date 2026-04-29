require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { google } = require('googleapis');
const http = require('http');
const url = require('url');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3333/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in server/.env');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/calendar.events'],
});

console.log('\n=== Google Calendar OAuth Setup ===\n');
console.log('1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Sign in with samyak@techuz.com and grant calendar access.');
console.log('3. You will be redirected back here automatically.\n');

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/callback') return;

  const code = parsed.query.code;
  if (!code) {
    res.end('No code received. Please try again.');
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.end('Success! You can close this tab. Check the terminal for your refresh token.');

    console.log('\n=== Token Retrieved ===\n');
    console.log('Add this to your server/.env file:\n');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log('\nDone! You can stop this script (Ctrl+C).\n');
  } catch (err) {
    res.end('Error exchanging code for token. Check the terminal.');
    console.error('Token exchange error:', err.message);
  }

  server.close();
});

server.listen(3333, () => {
  console.log('Waiting for OAuth callback on http://localhost:3333/callback ...\n');
});
