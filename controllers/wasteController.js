const waste = require("../model/wasteModel");


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
  const wasteExists = await waste.findOne({ name });

  if (wasteExists) {
    res.status(400);
    throw new Error("Already exists.");
  }

  //   Create new waste
  const resource = await waste.create({
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
  const id = req.params.id * 1;
  const singleData = datas.find((el) => el.id === id);
  if (id > datas.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      singleData,
    },
  });
  // res.status(500).json({
  //   status: "error",
  //   message: "internal server error",
  // });
};

const getAllWastes = async (req, res) => {
  res.status(200).json({
    status: "success",
    result: datas.length,
    data: {
      datas,
    },
  });
};

const updateWaste = async (req, res) => {
  if (req.params.id * 1 > datas.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      message: "updating nft",
    },
  });

  // res.status(500).json({
  //   status: "error",
  //   message: "internal server error",
  // });
};

const upgradeWaste = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};

const deleteWaste = async (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
  // res.status(500).json({
  //   status: "error",
  //   message: "internal server error",
  // });
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
};
