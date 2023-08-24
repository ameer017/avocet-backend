const express = require('express');
const { initiatePayment } = require('../controllers/paymentController');

const router = express.Router();

// Route for initiating payment
router.post('/initiate-payment', initiatePayment);

module.exports = router;
