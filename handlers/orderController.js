const asyncHandler = require("express-async-handler");
const { hashToken } = require("../utils");
const sendEmailToCollector = require("../utils/sendEmailToCollector");
const Token = require("../models/tokenModel");
const orderCreationEmail = require("../utils/orderCreationEmail");
const sendEmailToAdmin = require("../utils/sendEmailToAdmin");
const Order = require("../model/orderModel");
const UserCollection = require("../model/userModel");

const createOrder = asyncHandler(async (req, res) => {
  try {
    const {
      type,
      weight,
      address,
      amount,
      phone,
      sellerEmail,
      processedBy,
      id
    } = req.body;

    if (!type || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }


    const newOrder = await Order.create({
      type,
      weight,
      address,
      amount,
      phone,
      sellerEmail,
      id
    });

    if (newOrder) {
      const {
        type,
        weight,
        address,
        amount,
        phone,
        sellerEmail,
        status,
        processedBy,
        id
      } = newOrder;

      const collectors = await UserCollection.find({ role: "Collector" });

      if (!collectors) {
        return res.status(404).json({ message: "No collectors found" });
      }

      // Extract relevant information for each collector
      const collectorInfo = collectors.map((collector) => ({
        email: collector.email,
        name: collector.name,
        address: collector.address,
        phone: collector.phone,
        role: collector.role,
      }));

      const selectedCollectorId = req.body.selectedCollectorId;

      const selectedCollector = collectorInfo.find(
        (collector) => collector.id === selectedCollectorId
      );

      if (!selectedCollector) {
        return res
          .status(404)
          .json({ message: "Selected collector not found" });
      }

      await orderCreationEmail(
        sellerEmail,
        type,
        weight,
        amount,
        selectedCollector.email,
        selectedCollector.name,
        selectedCollector.address,
        selectedCollector.phone
      );

      await sendEmailToCollector(
        selectedCollector.email,
        type,
        weight,
        address,
        amount,
        phone,
        status,
        sellerEmail
      );

      res.status(201).json({
        type,
        weight,
        address,
        amount,
        phone,
        status,
        sellerEmail,
        processedBy,
        id
      });
    } else {
      res.status(400);
      throw new Error("Order data is invalid");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
});

const getOrder = asyncHandler(async (req, res) => {
  try {
    const orderId = req._id;
    console.log('Requested Order ID:', orderId); // Log the ID received in the request

    const order = await Order.findById(orderId);
    console.log('Retrieved Order:', order); // Log the order retrieved from MongoDB

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error('Error in getOrder:', err); // Log any potential errors
    res.status(500).json({ error: err.message });
  }
});


module.exports = {
  createOrder,
  getOrder,
};
