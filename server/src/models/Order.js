const mongoose = require('mongoose');
const { ORDER_STATUS } = require('../config/constants');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: Date,
  garmentType: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  measurements: { type: mongoose.Schema.Types.ObjectId, ref: 'Measurement' },
  fabricProvided: Boolean,
  fabricColor: String,
  stitchType: String,
  trialDate: Date,
  assignedTailor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ORDER_STATUS, default: 'pending' },
  notes: String,
}, { timestamps: true });

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);