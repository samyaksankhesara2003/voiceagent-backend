const { Model } = require('objection');

class Availability extends Model {
  static get tableName() {
    return 'availabilities';
  }

  static get relationMappings() {
    const Doctor = require('./Doctor');

    return {
      doctor: {
        relation: Model.BelongsToOneRelation,
        modelClass: Doctor,
        join: { from: 'availabilities.doctor_id', to: 'doctors.id' },
      },
    };
  }
}

module.exports = Availability;
