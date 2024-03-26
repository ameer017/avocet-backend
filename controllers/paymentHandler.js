const asyncHandler = require("express-async-handler");
const Payment = require("../model/payModel");

const initiatePayment = asyncHandler(async (req, res) => {
  const axios = require("axios");

  const { reference, destination } = req.body;

  try {
    const payment = await Payment.create({ reference, destination });
    console.log("Payment transaction saved:", payment);

    const response = await axios.post(
      "https://api.korapay.com/merchant/api/v1/transactions/disburse",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        maxBodyLength: Infinity,
      }
    );

    console.log("Response from payment API:", response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

module.exports = { initiatePayment };
