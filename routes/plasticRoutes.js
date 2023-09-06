const express = require("express");
const { 
    getOrders, 
    deleteOrder, 
    getOrder, 
    upgradeOrder, 
    updateOrder, 
    confirmOrder, 
    createOrder
} = require("../controllers/plasticController");

const { protect, authorOnly } = require("../middleware/authMiddleware");
const sendEmailToCollector = require("../utils/sendEmailToCollector");
const router = express.Router();

router.post("/create", protect, createOrder);
router.post("/confirm", protect, authorOnly, confirmOrder);
router.get("/getOrder", protect, getOrder);
router.get("/getOrders", protect, getOrders);
router.patch("/updateOrder", protect, updateOrder);

router.delete("/:id", protect, deleteOrder);
router.post("/upgradeOrder", protect, authorOnly, upgradeOrder);
router.post("/sendmailtocollector", protect, sendEmailToCollector)


module.exports = router;