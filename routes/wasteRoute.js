const express = require("express");
const router = express.Router();

const {
  protect,
  adminOnly,
  collectorOnly,
  sellerOnly,
} = require("../middleware/authMiddleware");
const { addPlastik, getPlastikById, getAllPlastiks } = require("../controllers/wasteController");

router.use(protect); 

router.post("/create", sellerOnly, addPlastik);
router.get("/:plastikId", getPlastikById);
router.get("/get-plastik", getAllPlastiks);
router.patch("/")

module.exports = router;
