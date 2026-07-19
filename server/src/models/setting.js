const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  shopName: { type: String, default: 'Tailoring Shop' },
  address: String,
  phone: String,
  email: String,
  gstin: String,
  logo: String,
});

module.exports = mongoose.model('Setting', settingSchema);