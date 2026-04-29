const { google } = require('googleapis');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

function isConfigured() {
  return !!(CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN);
}

function getAuthClient() {
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  return oauth2Client;
}

async function createGoogleCalendarEvent(appointment, patient, doctor) {
  if (!isConfigured()) return null;

  try {
    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    // Format date — MySQL may return a Date object or string
    let dateStr = appointment.date;
    if (dateStr instanceof Date) {
      dateStr = dateStr.toISOString().split('T')[0];
    } else if (typeof dateStr === 'string' && dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }

    const startDateTime = `${dateStr}T${appointment.start_time}`;
    const endDateTime = `${dateStr}T${appointment.end_time}`;

    console.log('Google Calendar: creating event', { startDateTime, endDateTime });

    const event = {
      summary: `Dental Appointment - ${patient.name} with ${doctor.name}`,
      description: [
        `Patient: ${patient.name}`,
        patient.phone ? `Phone: ${patient.phone}` : null,
        patient.email ? `Email: ${patient.email}` : null,
        `Doctor: ${doctor.name} (${doctor.specialty})`,
        `Booked via Voice AI Agent`,
      ].filter(Boolean).join('\n'),
      start: {
        dateTime: startDateTime,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Asia/Kolkata',
      },
    };

    const result = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    console.log('Google Calendar event created:', result.data.id);
    return {
      googleEventId: result.data.id,
      htmlLink: result.data.htmlLink,
    };
  } catch (err) {
    console.error('Google Calendar error (non-blocking):', err.message, err.response?.data?.error || '');
    return null;
  }
}

module.exports = { isConfigured, createGoogleCalendarEvent };
