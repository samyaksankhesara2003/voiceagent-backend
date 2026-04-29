const CalendarEvent = require('../../models/CalendarEvent');
const Doctor = require('../../models/Doctor');

async function createEvent(appointment, patient, trx) {
  const doctor = await Doctor.query(trx).findById(appointment.doctor_id);

  const dateStr = typeof appointment.date === 'string'
    ? appointment.date
    : new Date(appointment.date).toISOString().split('T')[0];

  const event = await CalendarEvent.query(trx).insert({
    appointment_id: appointment.id,
    external_event_id: `cal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: `Dental Appt: ${patient.name} with ${doctor.name}`,
    start_datetime: `${dateStr} ${appointment.start_time}:00`,
    end_datetime: `${dateStr} ${appointment.end_time}:00`,
  });

  console.log(`[MOCK CALENDAR] Event created: ${event.external_event_id} - ${event.title}`);
  return event;
}

module.exports = { createEvent };
