const axios = require('axios');
const asyncHandler = require('express-async-handler');
const Payment = require('../models/paymentModel');

const KORAPAY_SECRET_KEY = 'sk_test_ZCET4wATw3msqjyL9snbP8PAKbSr5auo5EYmfAWn'; 

// POST /api/payment/request
// Request payment for sellers
const requestPayment = asyncHandler(

  async (req, res) => {
  
    const {name, email, amount, bank, account, paid} = req.body;
  
    const requestData = {
      reference: `payment-${Date.now()}`,
      destination: {
        type: "bank_account",
        amount,
        currency: "NGN",
        narration: "Test Transfer Payment",
        bank_account: {
          bank,
          account,
        },
        customer: {
          name,
          email
        }
      }
    };
  
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.korapay.com/merchant/api/v1/transactions/disburse',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${KORAPAY_SECRET_KEY}`,
      },
      data : requestData
    };
  
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

    const referenceId = requestData.reference;
    const narration = requestData.destination.narration;
    const type = requestData.destination.type;

    const payment = await Payment.create({
      name, email, amount, bank, account,
      type, narration, referenceId, paid
    })

    if(payment) {
      const {_id, name, email, amount, bank, account, type, narration, referenceId, paid} = payment;

      res.status(201).json({
        name, email, 
        amount, bank, account,
        type, narration, referenceId, _id : payment._id, paid
      })
    } else {
      res.status(400);
      throw new Error("error!!")
    }
  } 
)

const getPaymentDetails = asyncHandler(async (req, res) => {
  const payments = await Payment.find().sort('-createdAt')
    

    if (!payments) {
        res.status(500);
        throw new Error("Something went wrong");
      }
      res.status(200).json(payments);
});

const upgradePayment = asyncHandler( async(req, res) => {
  const { paid, id} = req.body;

  const payment = await Payment.findById(id);

  if (!payment) {
    res.status(400);
    throw new Error("Payment not found");
  }

  payment.paid = true;
  await payment.save();

  res.status(200).json({
    message: `Payment completed`,
  });
})


module.exports = 
{
  requestPayment,
  getPaymentDetails,
  upgradePayment
};
