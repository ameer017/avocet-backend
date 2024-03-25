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
