const express = require("express");
const { reachOut, getMessages } = require("../controllers/contactHandler");
const router = express.Router();

router.post("/reachout", reachOut);
router.get("/get-messages", getMessages);
