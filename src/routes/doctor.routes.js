const express = require('express');
const router = express.Router();
const { listDoctors, getDoctorAvailability } = require('../controllers/doctor.controller');

router.get('/', listDoctors);
router.get('/:id/availability', getDoctorAvailability);

module.exports = router;
