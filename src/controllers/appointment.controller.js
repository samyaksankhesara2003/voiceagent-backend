const Appointment = require('../models/Appointment');

async function getAppointment(req, res) {
  try {
    const { id } = req.params;

    const appointment = await Appointment.query()
      .findById(parseInt(id))
      .withGraphFetched('[doctor, patient, intakeRecord, calendarEvent]');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
}

async function getAppointmentByCallId(req, res) {
  try {
    const { callId } = req.query;

    if (!callId) {
      return res.status(400).json({ error: 'callId query parameter is required' });
    }

    const appointment = await Appointment.query()
      .where('vapi_call_id', callId)
      .withGraphFetched('[doctor, patient, intakeRecord, calendarEvent]')
      .first();

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found for this call' });
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Error fetching appointment by call ID:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
}

module.exports = { getAppointment, getAppointmentByCallId };
