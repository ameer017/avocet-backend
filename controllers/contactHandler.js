const asyncHandler = require("express-async-handler");
const Contact = require("../model/contact");

const validateMail = (emailAddress) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    emailAddress.match(emailPattern) ? "Email is Valid" : "Invalid Email, Please try again"
}

exports.reachOut = asyncHandler(async (req, res) => {
    
    const { name, emailAddress, message } = req.body;

    // Properties Validation
    if (!name || !emailAddress || !message) {
        res.status(400)
        throw new Error("Please, fill all the required fields")
    }

    // External function to validate email
    validateMail();

    // Send and save to the database
    const newMessage = Contact.create({
        name, emailAddress, message
    })

    if (newMessage) {
        const { _id, name, emailAddress, message } = newMessage;

        res.json({
            _id, name, emailAddress, message
        })
    } else {
        res.status(500);
        throw new Error("Internal server error")
    }

})


