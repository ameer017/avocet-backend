const mongoose = require("mongoose");


const paymentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "plastic",
        },
        name: {
            type: String,
            // required: [true, "Please declare a type"],
        },
        email: {
            type: String,
            // required: [true, "Please add a weight"],
        },
        amount: {
            type: String,
        },
        bank: {
            type: String,
            // required: [true, "Please add an amount"],
        },
        account: {
            type: String,
            // required: [true, "Please add a phone Number"],
        },
        referenceId: {
            type: String,
            // required: [true, "Please add a phone Number"],
        },
        narration: {
            type: String,
            // required: [true, "Please add a phone Number"],
        },
        type: {
            type: String,
            // required: [true, "Please add a phone Number"],
        },
    },
    
    {
    timestamps: true,
    minimize: false,
    }

  );


const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
