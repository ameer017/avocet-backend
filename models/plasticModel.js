const mongoose = require("mongoose");


const plasticSchema = mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "plastic",
    },
    type: {
        type: String,
        required: [true, "Please declare a type"],
    },
    weight: {
        type: String,
        required: [true, "Please add a weight"],
    },
    address: {
        type: String,
    },
    amount: {
        type: String,
        // required: [true, "Please add an amount"],
    },
    phone: {
        type: String,
        required: [true, "Please add a phone Number"],
    },
    sellerEmail: {
        type: String,
        required: [true, "Please add an email"],
    },
    status: {
        type: String,
        required: true,
        default: "under processing",
    },
    account_Num: {
      type: String,
    },
    bank: {
      type: String,
    },
     
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    },
    
    {
    timestamps: true,
    minimize: false,
    }

  );


const Plastic = mongoose.model("Plastic", plasticSchema);
module.exports = Plastic;
