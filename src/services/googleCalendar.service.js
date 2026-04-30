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
    // Use local date methods to avoid UTC timezone shift (IST → UTC can change the date)
    let dateStr = appointment.date;
    if (dateStr instanceof Date) {
      const y = dateStr.getFullYear();
      const m = String(dateStr.getMonth() + 1).padStart(2, '0');
      const d = String(dateStr.getDate()).padStart(2, '0');
      dateStr = `${y}-${m}-${d}`;
    } else if (typeof dateStr === 'string' && dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }

    // Ensure time has seconds (HH:MM -> HH:MM:SS)
    const ensureSeconds = (t) => t && t.split(':').length === 2 ? `${t}:00` : t;

    const startDateTime = `${dateStr}T${ensureSeconds(appointment.start_time)}`;
    const endDateTime = `${dateStr}T${ensureSeconds(appointment.end_time)}`;

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

async function deleteGoogleCalendarEvent(googleEventId) {
  if (!isConfigured() || !googleEventId) return false;

  try {
    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: googleEventId,
    });

    console.log('Google Calendar event deleted:', googleEventId);
    return true;
  } catch (err) {
    console.error('Google Calendar delete error (non-blocking):', err.message);
    return false;
  }
}

module.exports = { isConfigured, createGoogleCalendarEvent, deleteGoogleCalendarEvent };
