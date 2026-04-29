const { Model } = require('objection');

class Appointment extends Model {
  static get tableName() {
    return 'appointments';
  }

  static get relationMappings() {
    const Patient = require('./Patient');
    const Doctor = require('./Doctor');
    const IntakeRecord = require('./IntakeRecord');
    const CalendarEvent = require('./CalendarEvent');
    const EhrRecord = require('./EhrRecord');

    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: { from: 'appointments.patient_id', to: 'patients.id' },
      },
      doctor: {
        relation: Model.BelongsToOneRelation,
        modelClass: Doctor,
        join: { from: 'appointments.doctor_id', to: 'doctors.id' },
      },
      intakeRecord: {
        relation: Model.HasOneRelation,
        modelClass: IntakeRecord,
        join: { from: 'appointments.id', to: 'intake_records.appointment_id' },
      },
      calendarEvent: {
        relation: Model.HasOneRelation,
        modelClass: CalendarEvent,
        join: { from: 'appointments.id', to: 'calendar_events.appointment_id' },
      },
      ehrRecord: {
        relation: Model.HasOneRelation,
        modelClass: EhrRecord,
        join: { from: 'appointments.id', to: 'ehr_records.appointment_id' },
      },
    };
  }
}

module.exports = Appointment;
