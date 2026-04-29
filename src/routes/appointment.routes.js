const express = require('express');
const router = express.Router();
const { getAppointment, getAppointmentByCallId, listAppointments } = require('../controllers/appointment.controller');

router.get('/', listAppointments);
router.get('/by-call', getAppointmentByCallId);
router.get('/:id', getAppointment);

module.exports = router;
