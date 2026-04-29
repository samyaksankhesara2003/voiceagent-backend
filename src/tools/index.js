const getDoctors = require('./getDoctors');
const checkAvailability = require('./checkAvailability');
const bookAppointment = require('./bookAppointment');
const collectIntake = require('./collectIntake');

const toolDispatcher = {
  get_doctors: getDoctors,
  check_availability: checkAvailability,
  book_appointment: bookAppointment,
  collect_intake: collectIntake,
};

module.exports = toolDispatcher;
