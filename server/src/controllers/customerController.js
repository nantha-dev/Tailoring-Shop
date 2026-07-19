const Customer = require('../models/Customer');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

exports.createCustomer = catchAsync(async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json({ success: true, customer });
});

exports.getCustomers = catchAsync(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
      { customerId: { $regex: search, $options: 'i' } },
    ];
  }
  const total = await Customer.countDocuments(filter);
  const customers = await Customer.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({
    success: true,
    customers,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

exports.getCustomer = catchAsync(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) throw new ApiError(404, 'Customer not found');
  res.json({ success: true, customer });
});

exports.updateCustomer = catchAsync(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!customer) throw new ApiError(404, 'Customer not found');
  res.json({ success: true, customer });
});

exports.deleteCustomer = catchAsync(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) throw new ApiError(404, 'Customer not found');
  res.json({ success: true, message: 'Customer deleted' });
});