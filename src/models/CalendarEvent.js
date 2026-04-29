const { Model } = require('objection');

class CalendarEvent extends Model {
  static get tableName() {
    return 'calendar_events';
  }

  static get relationMappings() {
    const Appointment = require('./Appointment');

    return {
      appointment: {
        relation: Model.BelongsToOneRelation,
        modelClass: Appointment,
        join: { from: 'calendar_events.appointment_id', to: 'appointments.id' },
      },
    };
  }
}

module.exports = CalendarEvent;
