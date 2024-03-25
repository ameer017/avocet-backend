const mongoose = require("mongoose");

const wasteSchema = mongoose.Schema({
  title: {
    type: String,
    require: [true, "please, provide a name"],
  },
  sellerEmail: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },

  weight: {
    type: Number,
    require: [true, "please, provide a specific weight"],
  },
  amount: {
    type: Number,
    require: [true, "please, provide a price"],
  },

  description: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    require: true,
  },
});

const waste = mongoose.model("Waste", wasteSchema);
module.exports = waste;
