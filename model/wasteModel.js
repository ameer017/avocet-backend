const mongoose = require("mongoose");

const wasteSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "please, provide a name"],
    },
    duration: {
      type: String,
      require: [true, "Must provide a duration"],
    },
    maxGroupSize: {
      type: Number,
      require: [true, "Must have a group size"],
    },
    difficulty: {
      type: String,
      require: [true, "Must have a difficulty level"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: [true, "please, provide a price"],
    },
    summary: {
      type: String,
      trim: true,
      require: [true, "Must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      require: [true, "Must Provide a cover image"],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const waste = mongoose.model("Waste", wasteSchema);
module.exports = waste;
