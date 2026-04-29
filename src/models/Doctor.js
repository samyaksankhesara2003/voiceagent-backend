const { Model } = require('objection');

class Doctor extends Model {
  static get tableName() {
    return 'doctors';
  }

  static get relationMappings() {
    const Availability = require('./Availability');
    const Appointment = require('./Appointment');

    return {
      availabilities: {
        relation: Model.HasManyRelation,
        modelClass: Availability,
        join: { from: 'doctors.id', to: 'availabilities.doctor_id' },
      },
      appointments: {
        relation: Model.HasManyRelation,
        modelClass: Appointment,
        join: { from: 'doctors.id', to: 'appointments.doctor_id' },
      },
    };
  }
}

module.exports = Doctor;
