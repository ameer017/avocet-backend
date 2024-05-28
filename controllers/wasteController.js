const Waste = require("../model/wasteModel");
const asyncHandler = require("express-async-handler");

const createWaste = asyncHandler(async (req, res) => {
  const { title, weight, amount, location, orderStatus } = req.body;
  const waste = new Waste({ title, weight, amount, location, orderStatus });
  await waste.save();
  res.status(201).json(waste);
});

const getWaste = asyncHandler(async (req, res) => {
  const waste = await Waste.findById(req.params.id);
  if (waste) {
    res.json(waste);
  } else {
    res.status(404).json({ message: "Waste not found" });
  }
});

const getAllWastes = asyncHandler(async (req, res) => {
  const wastes = await Waste.find({});
  res.json(wastes);
});

const deleteWaste = asyncHandler(async (req, res) => {
  const waste = await Waste.findById(req.params.id);
  if (waste) {
    await waste.deleteOne();
    res.json({ message: "Waste removed" });
  } else {
    res.status(404).json({ message: "Waste not found" });
  }
});

const updateWaste = asyncHandler(async (req, res) => {
  const { title, weight, amount, location, orderStatus } = req.body;
  const waste = await Waste.findById(req.params.id);

  if (waste) {
    waste.title = title || waste.title;
    waste.weight = weight || waste.weight;
    waste.amount = amount || waste.amount;
    waste.location = location || waste.location;
    waste.orderStatus = orderStatus || waste.orderStatus;

    const updatedWaste = await waste.save();
    res.json(updatedWaste);
  } else {
    res.status(404).json({ message: "Waste not found" });
  }
});

module.exports = {
  createWaste,
  getWaste,
  getAllWastes,
  deleteWaste,
  updateWaste,
};
