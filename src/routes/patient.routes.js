const express = require('express');
const router = express.Router();
const { listPatients } = require('../controllers/patient.controller');

router.get('/', listPatients);

module.exports = router;
