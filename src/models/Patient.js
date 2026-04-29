const { Model } = require('objection');

class Patient extends Model {
  static get tableName() {
    return 'patients';
  }

  static get relationMappings() {
    const Appointment = require('./Appointment');
    const IntakeRecord = require('./IntakeRecord');
    const CrmLead = require('./CrmLead');

    return {
      appointments: {
        relation: Model.HasManyRelation,
        modelClass: Appointment,
        join: { from: 'patients.id', to: 'appointments.patient_id' },
      },
      intakeRecords: {
        relation: Model.HasManyRelation,
        modelClass: IntakeRecord,
        join: { from: 'patients.id', to: 'intake_records.patient_id' },
      },
      crmLeads: {
        relation: Model.HasManyRelation,
        modelClass: CrmLead,
        join: { from: 'patients.id', to: 'crm_leads.patient_id' },
      },
    };
  }
}

module.exports = Patient;
