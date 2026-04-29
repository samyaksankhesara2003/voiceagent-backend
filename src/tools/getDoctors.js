const Doctor = require('../models/Doctor');

async function getDoctors() {
  const doctors = await Doctor.query().select('id', 'name', 'specialty');
  console.log(doctors, "doctors");

  return {
    doctors: doctors.map((d) => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
    })),
  };
}

module.exports = getDoctors;
