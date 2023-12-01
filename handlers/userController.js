const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { generateToken, hashToken } = require("../utils");
var parser = require("ua-parser-js");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const Encrypt = require("cryptr");
const { OAuth2Client } = require("google-auth-library");
const User = require("../model/userModel");

const encryption = new Encrypt(process.env.CRYPTR_KEY);

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

const registerCollector = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, address, role, phone } = req.body;

    const userExists = await User.findOne({ $or: [{ email }] });

    if (userExists) {
      return res
        .status(400)
        .json({ error: "Collector's email already in use" });
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be up to 6 characters.");
    }

    if (role !== "Collector") {
      res.status(400);
      throw new Error("Role not specified!!");
    }

    // Get UserAgent
    const ua = parser(req.headers["user-agent"]);
    const userAgent = [ua.ua];

    //   Create new user
    const user = await User.create({
      name,
      email,
      password,
      address,
      role,
      phone,
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
    console.log("Error in signupUser: ", err.message);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { password, email } = req.body;

    const user = await User.findOne({ email });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username or password" });

    // Trigger 2FA for unknown UserAgent
    const ua = parser(req.headers["user-agent"]);
    const thisUserAgent = ua.ua;
    console.log(thisUserAgent);
    const allowedAgent = user.userAgent.includes(thisUserAgent);

    if (!allowedAgent) {
      // Generate 6 digit code
      const loginCode = Math.floor(100000 + Math.random() * 900000);
      console.log(loginCode);

      // Encrypt login code before saving to DB
      const encryptedLoginCode = encryption.encrypt(loginCode.toString());

      // Delete Token if it exists in DB
      let userToken = await Token.findOne({ userId: user._id });
      if (userToken) {
        await userToken.deleteOne();
      }

      // Save Token to DB
      await new Token({
        userId: user._id,
        lToken: encryptedLoginCode,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60 * (60 * 1000), // 60mins
      }).save();

      res.status(400);
      throw new Error("New browser or device detected");
    }

    // Generate Token
    const token = generateToken(user._id);

    if (user && isPasswordCorrect) {
      // Send HTTP-only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      });

      const { _id, name, email, phone, address, photo, role, isVerified } =
        user;

      res.status(200).json({
        _id,
        name,
        email,
        phone,
        address,
        photo,
        role,
        isVerified,
        token,
      });
    } else {
      res.status(500);
      throw new Error("Something went wrong, please try again");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in loginUser: ", error.message);
  }
});

// Send Login Code
const sendLoginCode = asyncHandler(async (req, res) => {
    const { email } = req.params;
    const user = await User.findOne({ email });
  
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
  
    // Find Login Code in DB
    let userToken = await Token.findOne({
      userId: user._id,
      expiresAt: { $gt: Date.now() },
    });
  
    if (!userToken) {
      res.status(404);
      throw new Error("Invalid or Expired token, please login again");
    }
  
    const loginCode = userToken.lToken;
    const decryptedLoginCode = encryption.decrypt(loginCode);
  
    // Send Login Code
    const subject = "Login Access Code - AVOCET";
    const send_to = email;
    const sent_from = 'avocetsolutions@outlook.com';
    const reply_to = "noreply@avocet.com";
    const template = "loginCode";
    const name = user.name;
    const link = decryptedLoginCode;
  
    try {
      await sendEmail(
        subject,
        send_to,
        sent_from,
        reply_to,
        template,
        name,
        link
      );
      res.status(200).json({ message: `Access code sent to ${email}` });
    } catch (error) {
      res.status(500);
      throw new Error("Email not sent, please try again");
    }
  });

// Login With Code
const loginWithCode = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const { loginCode } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find user Login Token
  const userToken = await Token.findOne({
    userId: user.id,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token, please login again");
  }

  const decryptedLoginCode = encryption.decrypt(userToken.lToken);

  if (loginCode !== decryptedLoginCode) {
    res.status(400);
    throw new Error("Incorrect login code, please try again");
  } else {
    // Register userAgent
    const ua = parser(req.headers["user-agent"]);
    const thisUserAgent = ua.ua;
    user.userAgent.push(thisUserAgent);
    await user.save();

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

    const { _id, name, email, phone, add, photo, role, isVerified } = user;

    res.status(200).json({
      _id,
      name,
      email,
      phone,
      add,
      photo,
      role,
      isVerified,
      token,
    });
  }
});

// Send Verification Email
const sendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User already verified");
  }

  // Delete Token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  //   Create Verification Token and Save
  const verificationToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(verificationToken);

  // Hash token and save
  const hashedToken = hashToken(verificationToken);
  await new Token({
    userId: user._id,
    vToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * (60 * 1000), // 60mins
  }).save();

  // Construct Verification URL
  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

  // Send Email
  const subject = "Verify Your Account - AVOCET";
  const send_to = user.email;
  const sent_from = 'avocetsolutions@outlook.com';
  const reply_to = "noreply@avocet.com";
  const template = "verifyEmail";
  const name = user.name;
  const link = verificationUrl;

  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({ message: "Verification Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

// Verify User
const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  const hashedToken = hashToken(verificationToken);

  const userToken = await Token.findOne({
    vToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  // Find User
  const user = await User.findOne({ _id: userToken.userId });

  if (user.isVerified) {
    res.status(400);
    throw new Error("User is already verified");
  }

  // Now verify user
  user.isVerified = true;
  await user.save();

  res.status(200).json({ message: "Account Verification Successful" });
});


module.exports = {
  registerUser,
  registerCollector,
  loginUser,
  sendLoginCode,
  loginWithCode,
  sendVerificationEmail,
  verifyUser
};
