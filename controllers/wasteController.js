const datas = require("../model/wasteModel");
const APIFeatures = require("../utils/apiFeature");

const checkId = (req, res, next, value) => {
  console.log(`ID: ${value}`);
  if (req.params.id * 1 > datas.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "error",
      message: "Missing name and price",
    });
  }
  next();
};

const createWaste = async (req, res) => {
  const {
    name,
    duration,
    maxGroupSize,
    difficulty,
    ratingsAverage,
    ratingsQuantity,
    price,
    summary,
    description,
    imageCover,
    images,
    createdAt,
    startDates,
  } = req.body;

  // Check if user exists
  const wasteExists = await datas.findOne({ name });

  if (wasteExists) {
    res.status(400);
    throw new Error("Already exists.");
  }

  //   Create new waste
  const resource = await datas.create({
    name,
    duration,
    maxGroupSize,
    difficulty,
    ratingsAverage,
    ratingsQuantity,
    price,
    summary,
    description,
    imageCover,
    images,
    createdAt,
    startDates,
  });

  if (resource) {
    const {
      _id,
      name,
      duration,
      maxGroupSize,
      difficulty,
      ratingsAverage,
      ratingsQuantity,
      price,
      summary,
      description,
      imageCover,
      images,
      createdAt,
      startDates,
    } = resource;

    res.status(201).json({
      _id,
      name,
      duration,
      maxGroupSize,
      difficulty,
      ratingsAverage,
      ratingsQuantity,
      price,
      summary,
      description,
      imageCover,
      images,
      createdAt,
      startDates,
    });
  } else {
    res.status(400);
    throw new Error("Invalid waste data");
  }
};

const getWaste = async (req, res) => {
  const waste = await datas.findById(req.params.id);

  if (waste) {
    const {
      _id,
      name,
      duration,
      maxGroupSize,
      difficulty,
      ratingsAverage,
      ratingsQuantity,
      price,
      summary,
      description,
      imageCover,
      images,
      createdAt,
      startDates,
    } = waste;

    res.status(200).json({
      _id,
      name,
      duration,
      maxGroupSize,
      difficulty,
      ratingsAverage,
      ratingsQuantity,
      price,
      summary,
      description,
      imageCover,
      images,
      createdAt,
      startDates,
    });
  } else {
    res.status(404);
    throw new Error("Waste not found");
  }
};

const aliasTopWastes = async (req, res, next) => {
  (req.query.limit = "5"), (req.query.sort = "-ratingsAverage, price");
  req.query.fields = "name, price, ratingsAverage, difficulty";
  next();
};

const getAllWastes = async (req, res) => {
  try {
    const features = new APIFeatures(datas.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const allData = await features.query;

    res.status(200).json({
      status: "success",
      result: allData.length,
      data: {
        allData,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};

const updateWaste = async (req, res) => {
  const waste = await datas.findById(req.params._id);

  if (waste) {
    const {
      _id,
      name,
      duration,
      maxGroupSize,
      difficulty,
      ratingsAverage,
      ratingsQuantity,
      price,
      summary,
      description,
      imageCover,
      images,
      createdAt,
      startDates,
    } = waste;

    waste.name = name;
    waste.duration = req.body.duration || duration;
    waste.difficulty = req.body.difficulty || difficulty;
    waste.maxGroupSize = req.body.maxGroupSize || maxGroupSize;
    waste.ratingsAverage = req.body.ratingsAverage || ratingsAverage;
    waste.ratingsQuantity = req.body.ratingsQuantity || ratingsQuantity;
    waste.price = req.body.price || price;
    waste.summary = req.body.summary || summary;
    waste.description = req.body.description || description;
    waste.imageCover = req.body.imageCover || imageCover;
    waste.images = req.body.images || images;
    waste.startDates = startDates;

    const updatedWaste = await waste.save();

    res.status(200).json({
      _id: updatedWaste._id,
      name: updatedWaste.name,
      email: updatedWaste.email,
      phone: updatedWaste.phone,
      bio: updatedWaste.bio,
      photo: updatedWaste.photo,
      role: updatedWaste.role,
      isVerified: updatedWaste.isVerified,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

const upgradeWaste = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};

const deleteWaste = async (req, res) => {
  const waste = datas.findById(req.params.id);

  if (!waste) {
    res.status(404);
    throw new Error("Waste not found");
  }

  await waste.deleteOne();
  res.status(200).json({
    message: "Waste deleted successfully",
  });
};

module.exports = {
  createWaste,
  getWaste,
  getAllWastes,
  updateWaste,
  upgradeWaste,
  deleteWaste,
  checkId,
  checkBody,
  aliasTopWastes,
};
