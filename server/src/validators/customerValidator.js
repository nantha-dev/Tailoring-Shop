const { body } = require('express-validator');

exports.createCustomerValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('mobile').notEmpty().withMessage('Mobile number required'),
];

exports.updateCustomerValidator = [
  body('name').optional().notEmpty(),
  body('mobile').optional().notEmpty(),
];