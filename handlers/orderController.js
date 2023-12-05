const asyncHandler = require("express-async-handler");
const { hashToken } = require("../utils");
const sendEmailToCollector = require("../utils/sendEmailToCollector");
const Token = require("../models/tokenModel");
const orderCreationEmail = require("../utils/orderCreationEmail");
const sendEmailToAdmin = require("../utils/sendEmailToAdmin");
const User = require("../model/userModel");
const Order = require("../model/orderModel");

const createOrder = asyncHandler(

    async (req, res) => {
      try {
        const {
          type,
          weight,
          address,
          amount,
          phone,
          sellerEmail,
          createdBy,
          processedBy
        } = req.body;
    
        if (!type || !phone) {
          return res.status(400).json({ error: "All fields are required" });
        }
    
        const user = await User.findById(createdBy);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        if (user._id.toString() !== req.user._id.toString()) {
          return res.status(401).json({ error: "Unauthorized to create order" });
        }
    
        const newOrder = await Order.create({
          type,
          weight,
          address,
          amount,
          phone,
          sellerEmail,
          createdBy,
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
            createdBy
          } = newOrder;
    
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
            createdBy
          });
        } else {
          res.status(400);
          throw new Error("Order data is invalid");
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
      }
    }
)

const getOrder = asyncHandler(

  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (!order) {
        return res.status(404).json({ error: "order not found" });
      }
  
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
)



module.exports = {
  createOrder,
  getOrder
};
