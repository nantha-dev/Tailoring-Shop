const Measurement = require('../models/Measurement');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

exports.createMeasurement = catchAsync(async (req, res) => {
  const measurement = await Measurement.create(req.body);
  res.status(201).json({ success: true, measurement });
});

exports.getMeasurementsByCustomer = catchAsync(async (req, res) => {
  const measurements = await Measurement.find({ customer: req.params.customerId })
    .sort({ date: -1 });
  res.json({ success: true, measurements });
});

exports.getMeasurement = catchAsync(async (req, res) => {
  const measurement = await Measurement.findById(req.params.id).populate('customer');
  if (!measurement) throw new ApiError(404, 'Measurement not found');
  res.json({ success: true, measurement });
});

exports.updateMeasurement = catchAsync(async (req, res) => {
  const measurement = await Measurement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!measurement) throw new ApiError(404, 'Measurement not found');
  res.json({ success: true, measurement });
});

exports.deleteMeasurement = catchAsync(async (req, res) => {
  const measurement = await Measurement.findByIdAndDelete(req.params.id);
  if (!measurement) throw new ApiError(404, 'Measurement not found');
  res.json({ success: true, message: 'Measurement deleted' });
});