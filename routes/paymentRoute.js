const express = require('express');
const { requestPayment, getPaymentDetails } = require('../controllers/paymentController');

const router = express.Router();

// Route for initiating payment
router.post('/initiatePayment', requestPayment);
router.get('/get-payments', getPaymentDetails);

module.exports = router;
