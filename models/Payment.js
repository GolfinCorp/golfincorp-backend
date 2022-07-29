const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  name: { type: String, require: true },
  paymentMethod: { type: String },
  reference: { type: String },
  status: { type: String, default: "pending" },
  gameId: { type: String, required: true },
  clubId: { type: String, required: true },
});

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
