const express = require('express');
const { requestPayment, getPaymentDetails, upgradePayment } = require('../controllers/paymentController');

const router = express.Router();

// Route for initiating payment
router.post('/initiatePayment', requestPayment);
router.get('/get-payments', getPaymentDetails);
router.post('upgrade-payment', upgradePayment)

module.exports = router;
