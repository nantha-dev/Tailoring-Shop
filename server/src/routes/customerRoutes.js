const router = require('express').Router();
const { verifyToken, isStaff } = require('../middlewares/auth');
const { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { createCustomerValidator, updateCustomerValidator } = require('../validators/customerValidator');
const validate = require('../middlewares/validate');

router.use(verifyToken);
router.route('/')
  .get(getCustomers)
  .post(isStaff, createCustomerValidator, validate, createCustomer);
router.route('/:id')
  .get(getCustomer)
  .put(isStaff, updateCustomerValidator, validate, updateCustomer)
  .delete(isStaff, deleteCustomer);

module.exports = router;