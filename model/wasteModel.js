const mongoose = require("mongoose");

const plastikSchema = mongoose.Schema({
  title: {
    type: String,
    require: [true, "please, provide a name"],
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

  orderStatus: {
    type: String,
    default: "Created",
  },
});

const Plastik = mongoose.model("Plastik", plastikSchema);
module.exports = Plastik;
