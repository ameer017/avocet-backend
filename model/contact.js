const mongoose = require("mongoose");

const Schema = mongoose.Schema()

const contactModel = Schema({
    name: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    },
})

const Contact = mongoose.model("Contact", contactModel)
module.exports = Contact;