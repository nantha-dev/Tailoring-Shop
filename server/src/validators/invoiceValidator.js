const { body } = require('express-validator');

exports.createInvoiceValidator = [
  body('order').notEmpty().withMessage('Order ID required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item required'),
  body('grandTotal').isNumeric().withMessage('Grand total required'),
];