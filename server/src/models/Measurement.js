const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  date: { type: Date, default: Date.now },
  measurements: {
    chest: Number,
    waist: Number,
    hip: Number,
    shoulder: Number,
    neck: Number,
    sleeveLength: Number,
    armRound: Number,
    shirtLength: Number,
    pantLength: Number,
    thigh: Number,
    knee: Number,
    bottom: Number,
    inseam: Number,
    custom: mongoose.Schema.Types.Mixed, // e.g., { "customField": value }
  },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Measurement', measurementSchema);