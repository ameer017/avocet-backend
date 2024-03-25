const asyncHandler = require("express-async-handler");
const sendEmail = require("../Utils/sendEmail");

const addPlastik = asyncHandler(async (req, res) => {
  const { title, sellerEmail, weight, amount, location } = req.body;

  if (!title || !sellerEmail || !weight || !amount || !location) {
    res.status(400);
    throw new Error("Please provide all required fields.");
  }

  try {
    const plastik = new Plastik({
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

const getPlastik = asyncHandler(async (req, res) => {});
const getAllPlastiks = asyncHandler(async (req, res) => {});
const updatePlastik = asyncHandler(async (req, res) => {});
const upgradePlastik = asyncHandler(async (req, res) => {});
const deletePlastik = asyncHandler(async (req, res) => {});

module.exports = {
  addPlastik,
  getPlastik,
  getAllPlastiks,
  updatePlastik,
  upgradePlastik,
  deletePlastik,
};
