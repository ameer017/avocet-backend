const express = require("express");
const {
  createWaste,
  upgradeWaste,
  getAllWastes,
  getWaste,
  updateWaste,
  deleteWaste,
  checkId,
  checkBody,
} = require("../controllers/wasteController");

const router = express.Router();

router.param("id", checkId)

router.post("/create-waste", checkBody,createWaste);
router.post("/upgrade-waste-data", upgradeWaste);
router.get("/get-wastes-data", getAllWastes);
router.get("/get-waste-data/:id", getWaste);
router.patch("/update-waste-data/:id", updateWaste);
router.delete("/delete-waste/:id", deleteWaste);

module.exports = router;
