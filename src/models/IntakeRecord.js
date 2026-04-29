const { Model } = require('objection');

class IntakeRecord extends Model {
  static get tableName() {
    return 'intake_records';
  }

  static get relationMappings() {
    const Appointment = require('./Appointment');
    const Patient = require('./Patient');

    return {
      appointment: {
        relation: Model.BelongsToOneRelation,
        modelClass: Appointment,
        join: { from: 'intake_records.appointment_id', to: 'appointments.id' },
      },
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: { from: 'intake_records.patient_id', to: 'patients.id' },
      },
    };
  }
}

module.exports = IntakeRecord;
