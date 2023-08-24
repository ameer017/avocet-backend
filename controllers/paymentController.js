const axios = require('axios');

const FLUTTERWAVE_SECRET_KEY = 'FLWPUBK_TEST-491e470d88ecdd5c5e237a79979a758f-X';

const initiatePayment = async (req, res) => {
  try {
    const { amount, email, orderId } = req.body;

    // Make a request to Flutterwave API to initiate payment
    const response = await axios.post(
      'https://api.flutterwave.com/v3/charges?type=mobilemoneyghana',
      {
        tx_ref: orderId,
        amount,
        currency: 'NGN', // Use NGN for Nigerian Naira
        redirect_url: 'http://localhost:5173', // Replace with your actual success URL
        payment_type: 'accountdebit', // Use accountdebit for Nigerian payments
        order_id: orderId,
        customer: {
          email,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    const paymentLink = response.data.data.link;

    res.status(200).json({ paymentLink });
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ error: 'An error occurred while initiating payment' });
  }
};


module.exports = { initiatePayment };
