const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerId: { type: String, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  alternateNumber: String,
  email: String,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: String,
  city: String,
  pincode: String,
  notes: String,
}, { timestamps: true });

customerSchema.pre('save', async function (next) {
  if (!this.customerId) {
    const count = await mongoose.model('Customer').countDocuments();
    this.customerId = `CUST${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Customer', customerSchema);