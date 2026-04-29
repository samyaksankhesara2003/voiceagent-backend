const Doctor = require('../models/Doctor');
const Availability = require('../models/Availability');

async function listDoctors(req, res) {
  try {
    const doctors = await Doctor.query().select('id', 'name', 'specialty', 'bio');
    res.json({ doctors });
  } catch (error) {
    console.error('Error listing doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
}

async function getDoctorAvailability(req, res) {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required (YYYY-MM-DD)' });
    }

    const slots = await Availability.query()
      .where('doctor_id', parseInt(id))
      .where('date', date)
      .where('is_booked', false)
      .orderBy('start_time', 'asc');

    res.json({
      doctorId: parseInt(id),
      date,
      available: slots.length > 0,
      slots: slots.map((s) => ({
        id: s.id,
        startTime: s.start_time,
        endTime: s.end_time,
      })),
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
}

module.exports = { listDoctors, getDoctorAvailability };
