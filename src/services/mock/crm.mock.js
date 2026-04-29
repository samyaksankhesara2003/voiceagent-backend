const CrmLead = require('../../models/CrmLead');

async function createLead(patient, appointment, vapiCallId, trx) {
  const dateStr = typeof appointment.date === 'string'
    ? appointment.date
    : new Date(appointment.date).toISOString().split('T')[0];

  const lead = await CrmLead.query(trx).insert({
    patient_id: patient.id,
    source: 'voice_agent',
    interaction_summary:
      `Patient ${patient.name} booked dental appointment via voice agent. ` +
      `Appointment on ${dateStr} at ${appointment.start_time}.`,
    status: 'new',
    vapi_call_id: vapiCallId || null,
  });

  console.log(`[MOCK CRM] Lead created: ${lead.id} for patient ${patient.name}`);
  return lead;
}

module.exports = { createLead };
