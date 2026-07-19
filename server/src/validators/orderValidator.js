const { body } = require('express-validator');

exports.createOrderValidator = [
  body('customer').notEmpty().withMessage('Customer ID required'),
  body('garmentType').notEmpty().withMessage('Garment type required'),
  body('deliveryDate').optional().isISO8601().toDate(),
];

exports.updateOrderValidator = [
  body('status').optional().isIn([
    'pending', 'cutting', 'stitching', 'finishing', 'ready', 'delivered', 'cancelled'
  ]),
];