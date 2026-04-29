const express = require('express');
const router = express.Router();
const { getAppointment, getAppointmentByCallId } = require('../controllers/appointment.controller');

router.get('/by-call', getAppointmentByCallId);
router.get('/:id', getAppointment);

module.exports = router;
