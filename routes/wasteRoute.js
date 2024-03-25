const express = require("express");
const router = express.Router();

const {
  protect,
  adminOnly,
  authorOnly,
} = require("../middleware/authMiddleware");
const { addPlastik } = require("../controllers/wasteController");

router.post("/create", addPlastik);

module.exports = router;
