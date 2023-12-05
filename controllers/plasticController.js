const asyncHandler = require("express-async-handler");
const Plastic = require("../models/plasticModel");
const User = require("../models/userModel");
const { hashToken } = require("../utils");
const axios = require("axios");
const sendEmailToCollector = require("../utils/sendEmailToCollector");
const Token = require("../models/tokenModel");
const orderCreationEmail = require("../utils/orderCreationEmail");
const sendEmailToAdmin = require("../utils/sendEmailToAdmin");

// create order
const createOrder = asyncHandler(async (req, res) => {
  const {
    type,
    weight,
    address,
    amount,
    phone,
    sellerEmail,
    account_num,
    bank,
  } = req.body;

  // validation
  if (!type || !phone) {
    res.status(400);
    throw new Error("Please, fill in all the required fields");
  }

  // create new order
  const plastic = await Plastic.create({
    type,
    weight,
    address,
    amount,
    phone,
    sellerEmail,
    account_num,
    bank,
  });

  const id = plastic._id;

  if (plastic) {
    const {
      type,
      weight,
      address,
      amount,
      phone,
      sellerEmail,
      status,
      account_num,
      bank,
      id,
    } = plastic;

    const collectors = await User.find({ role: "Collector" });

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
      return res.status(404).json({ message: "Selected collector not found" });
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
      account_num,
      bank,
      sellerEmail,
      id
    );

    res.status(201).json({
      type,
      weight,
      address,
      amount,
      phone,
      status,
      sellerEmail,
      account_num,
      bank,
      id,
    });
  } else {
    res.status(400);
    throw new Error("Order data is invalid");
  }
});

// get order
const getOrder = asyncHandler(async (req, res) => {
  const plastic = await Plastic.findOne(req.params.name);

  if (plastic) {
    const {
      _id,
      name,
      phone,
      type,
      amount,
      status,
      weight,
      sellerEmail,
      account_num,
      bank,
    } = plastic;

    res.status(200).json({
      _id,
      name,
      phone,
      type,
      weight,
      amount,
      status,
      sellerEmail,
      account_num,
      bank,
    });
  } else {
    res.status(404);
    throw new Error("Order not found, please try again.");
  }
});

// Delete order
const deleteOrder = asyncHandler(async (req, res) => {
  const plastic = Plastic.findById(req.params.id);

  if (!plastic) {
    res.status(404);
    throw new Error("Order not found");
  }

  await plastic.deleteOne();
  res.status(200).json({
    message: "Order deleted successfully",
  });
});

// get orders
const getOrders = asyncHandler(async (req, res) => {
  const plastics = await Plastic.find().sort("-createdAt");

  if (!plastics) {
    res.status(500);
    throw new Error("Something went wrong");
  }
  res.status(200).json(plastics);
});

//   upgrade order
const upgradeOrder = asyncHandler(async (req, res) => {
  const { status, id } = req.body;

  const plastic = await Plastic.findById(id);

  if (!plastic) {
    res.status(404);
    throw new Error("Order not found");
  }

  plastic.status = status;
  await plastic.save();

  const admins = await User.find({ role: "admin" });

  if (!admins || admins.length === 0) {
    return res.status(404).json({ message: "No admin found" });
  }

  // Extract admin email addresses
  const adminEmails = admins.map((admin) => admin.email);

  try {
    // Send an email to each admin
    for (const adminEmail of adminEmails) {
      await sendEmailToAdmin(adminEmail, status);
    }

    res.status(200).json({
      message: `Order updated to ${status} and flagged for payment`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      message: "Error updating order and sending emails to admins.",
    });
  }
});

// Update Order
const updateOrder = asyncHandler(async (req, res) => {
  const plastic = await Plastic.findOne(req.params.name);

  if (plastic) {
    const { name, type, weight, phone, status, account_num, bank } = plastic;

    plastic.type = req.body.type || type;
    plastic.name = req.body.name || name;
    plastic.phone = req.body.phone || phone;
    plastic.weight = req.body.weight || weight;

    const updatedOrder = await plastic.save();

    res.status(200).json({
      _id: updatedOrder._id,
      user: updatedOrder.user,
      name: updatedOrder.name,
      phone: updatedOrder.phone,
      type: updatedOrder.type,
      weight: updatedOrder.weight,
      status: updatedOrder.status,
      account_num: updatedOrder.account_num,
      bank: updatedOrder.bank,
    });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// confirm order
const confirmOrder = asyncHandler(async (req, res) => {
  const plastic = await Plastic.findById(req.plastic._id);

  const confirmationToken =
    crypto.randomBytes(32).toString("hex") + plastic._id;

  // Hash token and save
  const hashedToken = hashToken(confirmationToken);
  await new Token({
    userId: plastic._id,
    vToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * (60 * 1000), // 60mins
  }).save();

  const confirmationUrl = `${process.env.FRONTEND_URL}/confirmOrder/${confirmationToken}`;

  // Send email to all users with role 'Collector'
  const collectors = await User.find({ role: "Collector" });
  collectors.forEach((collector) => {
    sendEmailToCollector(
      collector.email,
      _id,
      address,
      type,
      phone,
      amount,
      weight,
      account_num,
      bank,
      confirmationUrl
    );
  });
});

const sendOrderCreationEmail = asyncHandler(async (req, res) => {});

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  deleteOrder,
  upgradeOrder,
  updateOrder,
  confirmOrder,
  sendOrderCreationEmail,
};
