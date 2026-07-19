const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'upi', 'card'], required: true },
  date: { type: Date, default: Date.now },
  reference: String,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);