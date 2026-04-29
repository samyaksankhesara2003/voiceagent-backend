const EhrRecord = require('../../models/EhrRecord');

async function pushIntake(appointment, intake, trx) {
  const ehrRecord = await EhrRecord.query(trx).insert({
    appointment_id: appointment.id,
    external_ehr_id: `ehr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    structured_data: JSON.stringify({
      patient_id: appointment.patient_id,
      reason_for_visit: intake.reason_for_visit,
      symptoms: intake.symptoms,
      appointment_date: appointment.date,
      appointment_time: appointment.start_time,
      doctor_id: appointment.doctor_id,
      captured_at: new Date().toISOString(),
      source: 'voice_ai_agent',
    }),
    sync_status: 'synced',
  });

  console.log(`[MOCK EHR] Record pushed: ${ehrRecord.external_ehr_id}`);
  return ehrRecord;
}

module.exports = { pushIntake };
