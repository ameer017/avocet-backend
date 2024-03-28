const mongoose = require("mongoose");

const plastikSchema = mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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

  location: {
    type: String,
    require: true,
  },

  processedBy: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
      },
      name: {
        type: String,
      },
    },
  ],
});

const Plastik = mongoose.model("Plastik", plastikSchema);
module.exports = Plastik;
