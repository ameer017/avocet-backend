const express = require("express");
const {
  createWaste,
  getWaste,
  getAllWastes,
  deleteWaste,
} = require("../controllers/wasteController");
const router = express.Router();

router.post("/", createWaste);
router.get("/:id", getWaste);
router.get("/", getAllWastes);
router.delete("/:id", deleteWaste);

module.exports = router;
