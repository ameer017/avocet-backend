const express = require("express");
const router = express.Router();

const {
  protect,
  adminOnly,
  collectorOnly,
  sellerOnly,
} = require("../middleware/authMiddleware");
const { addPlastik } = require("../controllers/wasteController");

router.post("/create", sellerOnly, addPlastik);

module.exports = router;
