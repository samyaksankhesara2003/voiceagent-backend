const Availability = require('../models/Availability');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const calendarMock = require('../services/mock/calendar.mock');
const crmMock = require('../services/mock/crm.mock');
const knex = require('../config/database');

async function bookAppointment(params, call) {
  const { slotId, patientName, patientPhone, patientEmail } = params;
  console.log(slotId, patientName, patientPhone, patientEmail, ">>>");

  if (!slotId || !patientName) {
    return { success: false, message: 'Please provide a time slot and your name.' };
  }

  const slot = await Availability.query().findById(parseInt(slotId));
  console.log(slot);

  if (!slot || slot.is_booked) {
    return {
      success: false,
      message: 'This slot is no longer available. Please choose another time slot.',
    };
  }

  const result = await knex.transaction(async (trx) => {
    // Create patient
    const patient = await Patient.query(trx).insert({
      name: patientName,
      phone: patientPhone || null,
      email: patientEmail || null,
    });

    // Mark slot as booked
    await Availability.query(trx).findById(slot.id).patch({ is_booked: true });

    // Create appointment
    const appointment = await Appointment.query(trx).insert({
      patient_id: patient.id,
      doctor_id: slot.doctor_id,
      date: slot.date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      status: 'confirmed',
      vapi_call_id: call?.id || null,
    });

    // Mock integrations
    await calendarMock.createEvent(appointment, patient, trx);
    await crmMock.createLead(patient, appointment, call?.id, trx);

    return { appointment, patient };
  });

  const doctor = await Doctor.query().findById(slot.doctor_id);

  return {
    success: true,
    message: `Appointment confirmed for ${patientName}`,
    appointmentId: result.appointment.id,
    doctor: doctor.name,
    date: slot.date,
    time: `${slot.start_time} - ${slot.end_time}`,
  };
}

module.exports = bookAppointment;
