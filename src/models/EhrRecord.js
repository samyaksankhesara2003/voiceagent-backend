const { Model } = require('objection');

class EhrRecord extends Model {
  static get tableName() {
    return 'ehr_records';
  }

  static get relationMappings() {
    const Appointment = require('./Appointment');

    return {
      appointment: {
        relation: Model.BelongsToOneRelation,
        modelClass: Appointment,
        join: { from: 'ehr_records.appointment_id', to: 'appointments.id' },
      },
    };
  }
}

module.exports = EhrRecord;
