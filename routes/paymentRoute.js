const express = require("express");
const router = express.Router();

const {
  getSinglePayment,
  getAllPayments,
  deletePayment,
} = require("../controllers/paymentHandler");
const { adminOnly, protect } = require("../middleware/authMiddleware");

router.use(protect); 

router.post("/create-payment", adminOnly, getSinglePayment);
router.get("/:paymentId", protect, getSinglePayment);
router.get("/get-payments", adminOnly, getAllPayments);
router.delete("/:paymentId", adminOnly, deletePayment);

module.exports = router;
