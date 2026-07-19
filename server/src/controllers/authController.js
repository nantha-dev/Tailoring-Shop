const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

exports.register = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'Email already in use');

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) throw new ApiError(401, 'Account deactivated');

  const token = generateToken(user._id);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
};

exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const { name, email, phone } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, email, phone }, { new: true });
  res.json({ success: true, user });
});

exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, 'Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});