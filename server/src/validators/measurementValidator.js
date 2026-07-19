const { body } = require('express-validator');

exports.createMeasurementValidator = [
  body('customer').notEmpty().withMessage('Customer ID required'),
  body('measurements').isObject().withMessage('Measurements must be an object'),
];