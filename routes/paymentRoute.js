const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Route for initiating payment
router.post('/initiatePayment', paymentController);

module.exports = router;
