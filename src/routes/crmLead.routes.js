const express = require('express');
const router = express.Router();
const { getLeads } = require('../controllers/crmLead.controller');

router.get('/', getLeads);

module.exports = router;
