const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{
    description: String,
    quantity: Number,
    rate: Number,
    amount: Number,
  }],
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['paid', 'partial', 'unpaid'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['cash', 'upi', 'card'] },
  paidAmount: { type: Number, default: 0 },
  dueDate: Date,
  notes: String,
}, { timestamps: true });

invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `INV${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);