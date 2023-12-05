const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    amount: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    sellerEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "received",
    },
    processedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isProcessed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
