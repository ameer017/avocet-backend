const axios = require('axios');
const asyncHandler = require('express-async-handler');

const KORAPAY_SECRET_KEY = 'sk_test_ZCET4wATw3msqjyL9snbP8PAKbSr5auo5EYmfAWn'; 

// POST /api/payment/request
// Request payment for sellers
const requestPayment = asyncHandler(

  async (req, res) => {
  
    const {name, email, amount, bank, account} = req.body;
  
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
  } 
)

module.exports = requestPayment;
