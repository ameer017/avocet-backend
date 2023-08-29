const mongoose = require("mongoose");

const kycSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add a name"],
    },
    middleName: {
      type: String,
      required: [true, "Please add a name"],
    },
    lastName: {
      type: String,
      required: [true, "Please add a name"],
    },
    DOB: {
      type: String,
      required: [true, "Please add an account Number"],
    },
    gender: {
      type: String,
      required: [true, "Please add your bank name"],
    },
    stateOfOrigin: {
        type: String,
        required: true
    },
    localGovt: {
        type: String,
        required: true
    },
    VIN: {
        type: String,
        required: true,
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);


const Kyc = mongoose.model("Kyc", kycSchema);
module.exports = Kyc;
