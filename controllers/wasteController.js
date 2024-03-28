const asyncHandler = require("express-async-handler");
const sendEmail = require("../Utils/sendEmail");
const Plastik = require("../model/wasteModel");
const nodemailer = require("nodemailer");
const User = require("../model/userModel");

const addPlastik = asyncHandler(async (req, res) => {
  const { createdBy, title, sellerEmail, weight, amount, location } = req.body;

  if (!title || !sellerEmail || !weight || !amount || !location || !createdBy) {
    res.status(400);
    throw new Error("Please provide all required fields.");
  }

  if (weight < 5) {
    res.status(400);
    throw new Error("Weight should not less than 5 KG!!!");
  }

  const user = await User.findById(postedBy);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user._id.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: "Unauthorized to create post" });
  }

  try {
    const plastik = new Plastik({
      createdBy,
      title,
      sellerEmail,
      weight,
      amount,
      location,
    });

    await plastik.save();

    // Send email to seller
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: sellerEmail,
      subject: "Plastik Added",
      text: `Dear seller, your plastik with title "${title}" has been added successfully.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Plastik added successfully.", plastik });
  } catch (error) {
    console.error("Error adding plastik:", error);
    res.status(500);
    throw new Error("Failed to add plastik.");
  }
});

const getPlastikById = asyncHandler(async (req, res) => {
  const { plastikId } = req.params;

  try {
    // Find the Plastik by its ID in the database
    const plastik = await Plastik.findById(plastikId);

    if (!plastik) {
      // If the Plastik with the given ID is not found, send a 404 Not Found response
      res.status(404);
      throw new Error("Plastik not found.");
    }

    // If the Plastik is found, send it to the client
    res.status(200).json(plastik);
  } catch (error) {
    // Handle any errors that occur during the database interaction
    console.error("Error retrieving plastik:", error);
    res.status(500);
    throw new Error("Failed to retrieve plastik.");
  }
});

const getAllPlastiks = asyncHandler(async (req, res) => {
  const datas = await Plastik.find().sort("-createdAt").exec();
  if (!datas) {
    res.status(500);
    throw new Error("Something went wrong");
  }
  res.status(200).json(datas);
});

const updatePlastik = asyncHandler(async (req, res) => {
  const data = await Plastik.findById(req.data._id);

  if (data) {
    const { title, sellerEmail, weight, amount, location } = data;

    data.sellerEmail = sellerEmail;
    data.title = req.body.title || title;
    data.weight = req.body.weight || weight;
    data.amount = req.body.amount || amount;
    data.location = req.body.location || location;

    const updatedData = await data.save();

    res.status(200).json({
      _id: updatedData._id,
      title: updatedData.title,
      sellerEmail: updatedData.sellerEmail,
      weight: updatedData.weight,
      bio: updatedData.bio,
      amount: updatedData.amount,
      location: updatedData.location,
      isVerified: updatedData.isVerified,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const upgradePlastik = asyncHandler(async (req, res) => {});
const deletePlastik = asyncHandler(async (req, res) => {});

module.exports = {
  addPlastik,
  getPlastikById,
  getAllPlastiks,
  updatePlastik,
  upgradePlastik,
  deletePlastik,
};
