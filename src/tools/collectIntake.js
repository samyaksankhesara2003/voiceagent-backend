const Appointment = require('../models/Appointment');
const IntakeRecord = require('../models/IntakeRecord');
const ehrMock = require('../services/mock/ehr.mock');

async function collectIntake(params) {
  const { appointmentId, reasonForVisit, symptoms } = params;
  console.log(appointmentId, reasonForVisit, symptoms, "collectIntake");

  if (!appointmentId || !reasonForVisit) {
    return { success: false, message: 'Please provide the appointment and reason for visit.' };
  }

  const appointment = await Appointment.query()
    .findById(parseInt(appointmentId))
    .withGraphFetched('patient');

  if (!appointment) {
    return { success: false, message: 'Appointment not found.' };
  }

  const intake = await IntakeRecord.query().insert({
    appointment_id: appointment.id,
    patient_id: appointment.patient_id,
    reason_for_visit: reasonForVisit,
    symptoms: symptoms || null,
  });

  // Mock EHR push
  await ehrMock.pushIntake(appointment, intake);

  return {
    success: true,
    message: `Intake recorded: ${reasonForVisit}`,
  };
}

module.exports = collectIntake;
