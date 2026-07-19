const router = require('express').Router();
const { verifyToken, isStaff } = require('../middlewares/auth');
const { createMeasurement, getMeasurementsByCustomer, getMeasurement, updateMeasurement, deleteMeasurement } = require('../controllers/measurementController');
const { createMeasurementValidator } = require('../validators/measurementValidator');
const validate = require('../middlewares/validate');

router.use(verifyToken);
router.post('/', isStaff, createMeasurementValidator, validate, createMeasurement);
router.get('/customer/:customerId', getMeasurementsByCustomer);
router.route('/:id')
  .get(getMeasurement)
  .put(isStaff, updateMeasurement)
  .delete(isStaff, deleteMeasurement);

module.exports = router;