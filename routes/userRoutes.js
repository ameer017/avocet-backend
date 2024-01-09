const express = require("express");
const {
  createUser,
  getUser,
  updateUser,
  upgradeUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();

router.post("/create-user", createUser);
router.post("/upgrade-user-data", upgradeUser);
router.get("/get-users-data", getAllUsers);
router.get("/get-user-data/:id", getUser);
router.patch("/update-user-data/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);


module.exports = router;