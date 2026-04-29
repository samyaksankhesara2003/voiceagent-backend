const Availability = require('../models/Availability');

async function checkAvailability(params) {
  const { doctorId, date } = params;
  console.log(doctorId, date);

  if (!doctorId || !date) {
    return { available: false, message: 'Please provide both a doctor and a date.' };
  }

  const slots = await Availability.query()
    .where('doctor_id', parseInt(doctorId))
    .where('date', date)
    .where('is_booked', false)
    .orderBy('start_time', 'asc');
  console.log(slots, "slots");

  if (slots.length === 0) {
    return {
      available: false,
      message: `No available slots for this doctor on ${date}. Please try another date.`,
    };
  }

  return {
    available: true,
    slots: slots.map((s) => ({
      id: s.id,
      startTime: s.start_time,
      endTime: s.end_time,
    })),
  };
}

module.exports = checkAvailability;
