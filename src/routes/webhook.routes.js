const express = require('express');
const router = express.Router();
const { handleVapiWebhook } = require('../controllers/webhook.controller');

router.post('/vapi', handleVapiWebhook);

module.exports = router;
