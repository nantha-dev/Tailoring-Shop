const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.json({ success: true, users });
});

exports.createUser = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'Email already in use');
  const user = await User.create({ name, email, password, role });
  res.status(201).json({ success: true, user });
});

exports.toggleUserStatus = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, user });
});