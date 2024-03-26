const express = require("express");
const router = express.Router();

const {
  protect,
  adminOnly,
  collectorOnly,
  sellerOnly,
} = require("../middleware/authMiddleware");
const { addPlastik, getPlastikById } = require("../controllers/wasteController");

router.use(protect); 

router.post("/create", sellerOnly, addPlastik);
router.get("/:plastikId", getPlastikById);

module.exports = router;
