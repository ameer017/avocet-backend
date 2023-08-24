const express = require('express');
const requestPayment = require('../controllers/paymentController');

const router = express.Router();

// Route for initiating payment
router.post('/request-payment', requestPayment);

module.exports = router;
