const express = require('express');
const router = express.Router();
const googleCalendar = require('../services/googleCalendar.service');

// POST /api/test/calendar
// Body: { patientName, doctorName, specialty, date, startTime, endTime, phone?, email? }
router.post('/calendar', async (req, res) => {
  if (!googleCalendar.isConfigured()) {
    return res.status(500).json({ success: false, message: 'Google Calendar not configured. Check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN in .env' });
  }

  const { patientName, doctorName, specialty, date, startTime, endTime, phone, email } = req.body;

  if (!patientName || !doctorName || !date || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: 'Required fields: patientName, doctorName, date (YYYY-MM-DD), startTime (HH:MM:SS), endTime (HH:MM:SS)',
    });
  }

  const result = await googleCalendar.createGoogleCalendarEvent(
    { date, start_time: startTime, end_time: endTime },
    { name: patientName, phone: phone || null, email: email || null },
    { name: doctorName, specialty: specialty || 'General Dentistry' }
  );

  if (result) {
    res.json({ success: true, googleEventId: result.googleEventId, htmlLink: result.htmlLink });
  } else {
    res.status(500).json({ success: false, message: 'Failed to create Google Calendar event. Check server logs.' });
  }
});

module.exports = router;
