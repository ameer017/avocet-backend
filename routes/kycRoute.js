const express = require("express");
const createKyc = require("../controllers/kycController");
const router = express.Router();

router.post('/kyc-verification', createKyc)

module.exports = router;