const express = require("express");
const {
  createWaste,
  upgradeWaste,
  getAllWastes,
  getWaste,
  updateWaste,
  deleteWaste,
} = require("../controllers/wasteController");

const router = express.Router();

router.post("/create-waste", createWaste);
router.post("/upgrade-waste-data", upgradeWaste);
router.get("/get-wastes-data", getAllWastes);
router.get("/get-waste-data/:id", getWaste);
router.patch("/update-waste-data/:id", updateWaste);
router.delete("/delete-waste/:id", deleteWaste);

module.exports = router;
