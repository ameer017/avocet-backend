const datas = require("../data/nft-simple.json");
const fs = require("fs");
const filePath = "../data/nft-simple.json";

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
  if(!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "error",
      message: "Missing name and price"
    })
  }
  next()
}

const createWaste = async (req, res) => {
  const newId = datas[datas.length - 1] + 1;
  const newWaste = Object.assign({ id: newId }, req.body);

  const newData = datas.push(newWaste);
  console.log(newData);

  fs.writeFile(filePath, JSON.stringify(newData), (err) => {
    res.status(201).json({
      status: "success",

      data: {
        newWaste,
      },
    });
  });
  //   res.status(500).json({
  //     status: "error",
  //     message: "internal server error",
  //   });
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
  checkBody
};
