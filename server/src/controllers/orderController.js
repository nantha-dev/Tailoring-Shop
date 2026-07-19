const Order = require('../models/Order');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

exports.createOrder = catchAsync(async (req, res) => {
  const order = await Order.create(req.body);
  const populated = await Order.findById(order._id)
    .populate('customer', 'name mobile')
    .populate('measurements')
    .populate('assignedTailor', 'name');
  res.status(201).json({ success: true, order: populated });
});

exports.getOrders = catchAsync(async (req, res) => {
  const { search, status, startDate, endDate, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'customer.name': { $regex: search, $options: 'i' } },
    ];
  }
  if (status) filter.status = status;
  if (startDate && endDate) {
    filter.orderDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else if (startDate) {
    filter.orderDate = { $gte: new Date(startDate) };
  } else if (endDate) {
    filter.orderDate = { $lte: new Date(endDate) };
  }

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('customer', 'name mobile')
    .populate('assignedTailor', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({
    success: true,
    orders,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

exports.getOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer')
    .populate('measurements')
    .populate('assignedTailor', 'name');
  if (!order) throw new ApiError(404, 'Order not found');
  res.json({ success: true, order });
});

exports.updateOrder = catchAsync(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('customer')
    .populate('measurements')
    .populate('assignedTailor', 'name');
  if (!order) throw new ApiError(404, 'Order not found');
  res.json({ success: true, order });
});

exports.deleteOrder = catchAsync(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  res.json({ success: true, message: 'Order deleted' });
});

exports.getOrderHistory = catchAsync(async (req, res) => {
  const { customerId, status, startDate, endDate } = req.query;
  const filter = {};
  if (customerId) filter.customer = customerId;
  if (status) filter.status = status;
  if (startDate && endDate) {
    filter.orderDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  const orders = await Order.find(filter)
    .populate('customer', 'name')
    .sort({ orderDate: -1 });
  res.json({ success: true, orders });
});