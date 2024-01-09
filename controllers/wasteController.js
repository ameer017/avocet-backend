const datas = require("../data/nft-simple.json");

const createWaste = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};

const getWaste = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};

const getAllWastes = async (req, res) => {
  res.status(200).json({
    status: "success",
    result: datas.length,
    data: {
      datas
    },
  });
};

const updateWaste = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};

const upgradeWaste = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};

const deleteWaste = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};

module.exports = {
  createWaste,
  getWaste,
  getAllWastes,
  updateWaste,
  upgradeWaste,
  deleteWaste,
};
