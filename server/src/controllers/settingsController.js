const Settings = require('../models/Setting');
const catchAsync = require('../utils/catchAsync');

exports.getSettings = catchAsync(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json({ success: true, settings });
});

exports.updateSettings = catchAsync(async (req, res) => {
  const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
  res.json({ success: true, settings });
});