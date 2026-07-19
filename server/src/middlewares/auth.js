const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

exports.verifyToken = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new ApiError(401, 'Not authenticated');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new ApiError(401, 'User not found or inactive');
    }
    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, error.message || 'Authentication failed'));
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') next();
  else next(new ApiError(403, 'Admin access required'));
};

exports.isStaff = (req, res, next) => {
  if (req.user?.role === 'staff' || req.user?.role === 'admin') next();
  else next(new ApiError(403, 'Staff access required'));
};