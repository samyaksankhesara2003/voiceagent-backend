const Patient = require('../models/Patient');

async function listPatients(req, res) {
  try {
    const patients = await Patient.query().orderBy('created_at', 'desc');
    res.json({ patients });
  } catch (error) {
    console.error('Error listing patients:', error);
    res.status(500).json({ error: 'Failed to list patients' });
  }
}

module.exports = { listPatients };
