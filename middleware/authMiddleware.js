const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Get user id from token
    const user = await User.findById(verified.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.role === "suspended") {
      res.status(400);
      throw new Error("User suspended, please contact support");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
});

const verifiedOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized, account not verified");
  }
});

const collectorOnly = asyncHandler(async (req, res, next) => {
  if (req.user.role === "collector" || req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as a collector");
  }
});

const sellerOnly = asyncHandler(async (req, res, next) => {
  if (req.user.role === "seller") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as a seller");
  }
});

const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
});

module.exports = {
  protect,
  verifiedOnly,
  collectorOnly,
  adminOnly,
  sellerOnly
};
