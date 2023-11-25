const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const { generateToken } = require("../utils");


const contactForm = asyncHandler(async(req, res) => {
    const {firstName, lastName, email, message} = req.body;

    if(!firstName || !lastName || !email || !message){
        res.status(400)
        throw new Error("All fields are required!!")
    }

    const form = await Contact.create({
        firstName, lastName, email, message
    })

    const token = generateToken(form._id);

      // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if(form) {
    const {firstName, lastName, email, message, _id} = form;

    res.status(201).json({
        _id,
        firstName,
        lastName,
        email,
        message,
        token
    })
  }else{
    res.status(400)
    throw new Error("Invalid data")
  }
})

module.exports = {
    contactForm
}