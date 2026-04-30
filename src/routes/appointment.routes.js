const express = require('express');
const router = express.Router();
const { getAppointment, getAppointmentByCallId, listAppointments, deleteAppointment } = require('../controllers/appointment.controller');

router.get('/', listAppointments);
router.get('/by-call', getAppointmentByCallId);
router.get('/:id', getAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
