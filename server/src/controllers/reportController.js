const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const catchAsync = require('../utils/catchAsync');
const pdfService = require('../services/pdfService');
const excelService = require('../services/excelService');

exports.getOrderReport = catchAsync(async (req, res) => {
  const { from, to, status } = req.query;
  const filter = {};
  if (from && to) filter.orderDate = { $gte: new Date(from), $lte: new Date(to) };
  if (status) filter.status = status;

  const orders = await Order.find(filter).populate('customer', 'name');
  res.json({ success: true, orders });
});

exports.getRevenueReport = catchAsync(async (req, res) => {
  const { from, to } = req.query;
  const filter = {};
  if (from && to) filter.createdAt = { $gte: new Date(from), $lte: new Date(to) };
  const invoices = await Invoice.find(filter).populate('customer', 'name');
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  res.json({ success: true, invoices, totalRevenue });
});

exports.exportOrdersPDF = catchAsync(async (req, res) => {
  const orders = await Order.find().populate('customer', 'name');
  const doc = await pdfService.generateOrdersPDF(orders);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=orders-report.pdf');
  doc.pipe(res);
  doc.end();
});

exports.exportOrdersExcel = catchAsync(async (req, res) => {
  const orders = await Order.find().populate('customer', 'name');
  const buffer = await excelService.generateOrdersExcel(orders);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=orders-report.xlsx');
  res.send(buffer);
});