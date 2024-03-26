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

const getSinglePayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      res.status(404);
      throw new Error("Payment not found");
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error("Error retrieving payment:", error);
    res.status(500).json({ error: "Failed to retrieve payment" });
  }
});

const getAllPayments = asyncHandler(async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error retrieving payments:", error);
    res.status(500).json({ error: "Failed to retrieve payments" });
  }
});

const deletePayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      res.status(404);
      throw new Error("Payment not found");
    }

    await payment.remove();
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ error: "Failed to delete payment" });
  }
});

module.exports = {
  initiatePayment,
  getSinglePayment,
  getAllPayments,
  deletePayment,
};
