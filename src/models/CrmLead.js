const { Model } = require('objection');

class CrmLead extends Model {
  static get tableName() {
    return 'crm_leads';
  }

  static get relationMappings() {
    const Patient = require('./Patient');

    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: { from: 'crm_leads.patient_id', to: 'patients.id' },
      },
    };
  }
}

module.exports = CrmLead;
