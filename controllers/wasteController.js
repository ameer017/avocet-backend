const datas = require("../model/wasteModel");

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
  const singleData = datas.find({
    difficulty: "easy",
    duration: 5,
  });
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
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // ADVANCED FILTERING QUERY
    let queryStr = JSON.stringify(queryObj);
    hello = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = datas.find(JSON.parse(hello));
    // {difficulty: 'easy', duration: {$gte: 5}}
    // {difficulty: 'easy', duration: {gte: '5'}}
    // {difficulty: 'easy', duration: {'$gte': '5'}}

    // sorting data
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // FIELD METHOD
    if (req.query.fields) {
      const field = req.query.fields.split(",").join(" ");
      query = query.select(field);
    } else {
      query = query.select("-__v");
    }

    // Pagination functionality
    const page = req.query.pqge * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const newData = await datas.countDocuments();
      if (skip >= newData) throw new Error("Page not found");
    }
    //page=2&limit=3, page = 1, 1 - 10

    const allData = await query;

    res.status(200).json({
      status: "success",
      result: allData.length,
      data: allData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
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

const aliasTopWastes = async (req, res, next) => {
  (req.query.limit = "5"), (req.query.sort = "-ratingsAverage, price");
  req.query.fields = "name, price, ratingsAverage, difficulty";
  next();
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
