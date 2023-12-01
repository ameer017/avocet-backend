const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { generateToken, hashToken } = require("../utils");
var parser = require("ua-parser-js");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const Cryptr = require("cryptr");
const { OAuth2Client } = require("google-auth-library");
const { default: User } = require("../model/userModel");

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be up to 6 characters.");
    }

    const userExists = await User.findOne({ $or: [{ email }] });

    if (userExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const ua = parser(req.headers["user-agent"]);
    const userAgent = [ua.ua];

    const user = await User.create({
        name,
        email,
        password,
        address,
        userAgent,
      });
    
      // Generate Token
      const token = generateToken(user._id);
    
      // Send HTTP-only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      });


      if (user) {
        const { _id, name, email, phone, photo, role, isVerified } = user;
    
        res.status(201).json({
          _id,
          name,
          email,
          phone,
          photo,
          address,
          role,
          isVerified,
          token,
        });
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error while signing up user: ", err.message);
  }
});
