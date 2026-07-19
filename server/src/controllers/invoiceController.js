const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

exports.createInvoice = catchAsync(async (req, res) => {
  const invoice = await Invoice.create(req.body);
  const populated = await Invoice.findById(invoice._id)
    .populate('order')
    .populate('customer', 'name mobile');
  res.status(201).json({ success: true, invoice: populated });
});

exports.getInvoices = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { invoiceNumber: { $regex: search, $options: 'i' } },
    ];
  }
  const total = await Invoice.countDocuments(filter);
  const invoices = await Invoice.find(filter)
    .populate('customer', 'name')
    .populate('order', 'orderNumber')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({
    success: true,
    invoices,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

exports.getInvoice = catchAsync(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('customer')
    .populate('order');
  if (!invoice) throw new ApiError(404, 'Invoice not found');
  const payments = await Payment.find({ invoice: invoice._id });
  res.json({ success: true, invoice, payments });
});

exports.updateInvoice = catchAsync(async (req, res) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!invoice) throw new ApiError(404, 'Invoice not found');
  res.json({ success: true, invoice });
});

exports.recordPayment = catchAsync(async (req, res) => {
  const { amount, method, reference } = req.body;
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) throw new ApiError(404, 'Invoice not found');

  const payment = await Payment.create({
    invoice: invoice._id,
    amount,
    method,
    reference,
  });

  invoice.paidAmount += amount;
  if (invoice.paidAmount >= invoice.grandTotal) {
    invoice.paymentStatus = 'paid';
  } else if (invoice.paidAmount > 0) {
    invoice.paymentStatus = 'partial';
  }
  await invoice.save();

  res.status(201).json({ success: true, payment, invoice });
});