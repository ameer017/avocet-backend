const express = require("express");


const { protect, authorOnly } = require("../middleware/authMiddleware");
const { createOrder } = require("../handlers/orderController");
const router = express.Router();

router.post("/create", protect, createOrder);
// router.post("/confirm", protect, authorOnly, confirmOrder);
// router.get("/getOrder", protect, getOrder);
// router.get("/getOrders", protect, getOrders);
// router.patch("/updateOrder", protect, updateOrder);

// router.delete("/:id", protect, deleteOrder);
// router.post("/upgradeOrder", protect, authorOnly, upgradeOrder);
// router.post("/sendmailtocollector", protect, sendOrderCreationEmail)


module.exports = router;