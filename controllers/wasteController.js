const asyncHandler = require("express-async-handler");
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
    return res.status(401).json({ error: "Unauthorized to create order" });
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
    const plastik = await Plastik.findById(plastikId);

    if (!plastik) {
      res.status(404);
      throw new Error("Plastik not found.");
    }

    res.status(200).json(plastik);
  } catch (error) {
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
    const { title, sellerEmail, weight, amount, location, status } = data;

    data.sellerEmail = sellerEmail;
    data.title = req.body.title || title;
    data.weight = req.body.weight || weight;
    data.amount = req.body.amount || amount;
    data.location = req.body.location || location;
    data.status = req.body.status || status;

    const updatedData = await data.save();

    res.status(200).json({
      _id: updatedData._id,
      title: updatedData.title,
      sellerEmail: updatedData.sellerEmail,
      weight: updatedData.weight,
      bio: updatedData.bio,
      amount: updatedData.amount,
      location: updatedData.location,
      status: updatedData.status,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const processPlastik = asyncHandler(async (req, res) => {
  try {
    const plastikId = req.params.id;
    const userId = req.user._id;
    const phone = req.user.phone;
    const name = req.user.name;
    const status = req.body;

    const plastik = await Plastik.findById(plastikId);
    if (!plastik) {
      return res.status(404).json({ error: "Plastic not found" });
    }

    const result = { userId, phone, name };

    plastik.status = status;
    plastik.processedBy.push(result);
    await plastik.save();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const deletePlastik = asyncHandler(async (req, res) => {
  const plastik = Plastik.findById(req.params.id);

  if (!plastik) {
    res.status(404);
    throw new Error("plastik not found");
  }

  await plastik.deleteOne();
  res.status(200).json({
    message: "plastik deleted successfully",
  });
});

module.exports = {
  addPlastik,
  getPlastikById,
  getAllPlastiks,
  updatePlastik,
  processPlastik,
  deletePlastik,
};
