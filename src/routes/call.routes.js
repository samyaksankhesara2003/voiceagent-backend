const express = require('express');
const router = express.Router();
const { getCallDetails } = require('../controllers/call.controller');

router.get('/:callId', getCallDetails);

module.exports = router;
