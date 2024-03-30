const express = require("express");
const router = express.Router();

const {
  protect,
  adminOnly,
  collectorOnly,
  sellerOnly,
} = require("../middleware/authMiddleware");
const {
  addPlastik,
  getPlastikById,
  getAllPlastiks,
  updatePlastik,
  processPlastik,
  deletePlastik,
} = require("../controllers/wasteController");

router.use(protect);

router.post("/create", sellerOnly, addPlastik);
router.post("/upgrade-plastik", protect, adminOnly, processPlastik);

router.get("/:plastikId", getPlastikById);
router.get("/get-plastik", getAllPlastiks);

router.patch("/update-plastik", collectorOnly, updatePlastik);
router.delete("/:id", protect, adminOnly, deletePlastik);

module.exports = router;
