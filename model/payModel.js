const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true
  },
  destination: {
    type: {
      type: String,
      enum: ['bank_account'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    narration: {
      type: String,
      required: true
    },
    bank_account: {
      bank: {
        type: String,
        required: true
      },
      account: {
        type: String,
        required: true
      }
    },
    customer: {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      }
    }
  },
  response: { 
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
