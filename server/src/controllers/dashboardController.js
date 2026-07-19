const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');
const catchAsync = require('../utils/catchAsync');

exports.getDashboardStats = catchAsync(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayOrders = await Order.countDocuments({ orderDate: { $gte: today, $lt: tomorrow } });
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const inProgressOrders = await Order.countDocuments({ status: { $in: ['cutting', 'stitching', 'finishing'] } });
  const readyOrders = await Order.countDocuments({ status: 'ready' });
  const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
  const totalCustomers = await Customer.countDocuments();

  const monthlyRevenueAgg = await Invoice.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        paymentStatus: { $in: ['paid', 'partial'] },
      },
    },
    { $group: { _id: null, total: { $sum: '$grandTotal' } } },
  ]);
  const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;

  const recentOrders = await Order.find()
    .populate('customer', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  // Revenue chart data (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const revenueChart = await Invoice.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: { $in: ['paid', 'partial'] } } },
    { $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        total: { $sum: '$grandTotal' },
      } },
    { $sort: { _id: 1 } },
  ]);

  // Orders chart (last 6 months)
  const ordersChart = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
      } },
    { $sort: { _id: 1 } },
  ]);

  // Status distribution
  const statusDistribution = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    stats: {
      todayOrders,
      pendingOrders,
      inProgressOrders,
      readyOrders,
      deliveredOrders,
      totalCustomers,
      monthlyRevenue,
      recentOrders,
      charts: {
        revenue: revenueChart,
        orders: ordersChart,
        statusDistribution,
      },
    },
  });
});