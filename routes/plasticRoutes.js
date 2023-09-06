const express = require("express");
const { 
    getOrders, 
    deleteOrder, 
    getOrder, 
    upgradeOrder, 
    updateOrder, 
    confirmOrder, 
    createOrder,
    sendOrderCreationEmail
} = require("../controllers/plasticController");

const { protect, authorOnly } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create", protect, createOrder);
router.post("/confirm", protect, authorOnly, confirmOrder);
router.get("/getOrder", protect, getOrder);
router.get("/getOrders", protect, getOrders);
router.patch("/updateOrder", protect, updateOrder);

router.delete("/:id", protect, deleteOrder);
router.post("/upgradeOrder", protect, authorOnly, upgradeOrder);
router.post("/sendmailtocollector", protect, sendOrderCreationEmail)


module.exports = router;