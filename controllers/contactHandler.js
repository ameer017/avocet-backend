const asyncHandler = require("express-async-handler");
const Contact = require("../model/contactModel");

const reachOut = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Please, fill in all the required fields.");
  }

  const data = await Contact.create({
    name,
    email,
    message,
  });

  if (data) {
    const { _id, name, email, message } = data;

    res.status(201).json({
      _id,
      name,
      email,
      message,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const getMessages = asyncHandler(async (req, res) => {
  const datas = await Contact.find().sort("-createdAt").exec();
  if (!datas) {
    res.status(500);
    throw new Error("Something went wrong");
  }
  res.status(200).json(datas);
});

module.exports = { reachOut, getMessages };
