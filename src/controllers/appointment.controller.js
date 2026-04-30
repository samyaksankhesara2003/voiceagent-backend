const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const IntakeRecord = require('../models/IntakeRecord');
const CalendarEvent = require('../models/CalendarEvent');
const EhrRecord = require('../models/EhrRecord');
const CrmLead = require('../models/CrmLead');
const googleCalendar = require('../services/googleCalendar.service');
const knex = require('../config/database');

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

async function listAppointments(req, res) {
  try {
    const appointments = await Appointment.query()
      .withGraphFetched('[doctor, patient]')
      .orderBy('created_at', 'desc');

    res.json({ appointments });
  } catch (error) {
    console.error('Error listing appointments:', error);
    res.status(500).json({ error: 'Failed to list appointments' });
  }
}

async function deleteAppointment(req, res) {
  const { id } = req.params;

  try {
    const appointment = await Appointment.query()
      .findById(parseInt(id))
      .withGraphFetched('[calendarEvent]');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await knex.transaction(async (trx) => {
      // 1. Delete Google Calendar event if exists
      if (appointment.calendarEvent?.external_event_id) {
        await googleCalendar.deleteGoogleCalendarEvent(appointment.calendarEvent.external_event_id);
      }

      // 2. Delete related records
      await CalendarEvent.query(trx).delete().where('appointment_id', id);
      await IntakeRecord.query(trx).delete().where('appointment_id', id);
      await EhrRecord.query(trx).delete().where('appointment_id', id);
      await CrmLead.query(trx).delete().where('vapi_call_id', appointment.vapi_call_id);

      // 3. Free the availability slot
      await Availability.query(trx)
        .where({
          doctor_id: appointment.doctor_id,
          date: appointment.date,
          start_time: appointment.start_time,
        })
        .patch({ is_booked: false });

      // 4. Delete the appointment
      await Appointment.query(trx).deleteById(parseInt(id));
    });

    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
}

module.exports = { getAppointment, getAppointmentByCallId, listAppointments, deleteAppointment };
