const router = require('express').Router();
const { verifyToken, isStaff } = require('../middlewares/auth');
const { createInvoice, getInvoices, getInvoice, updateInvoice, recordPayment } = require('../controllers/invoiceController');
const { createInvoiceValidator } = require('../validators/invoiceValidator');
const validate = require('../middlewares/validate');

router.use(verifyToken);
router.route('/')
  .get(getInvoices)
  .post(isStaff, createInvoiceValidator, validate, createInvoice);
router.route('/:id')
  .get(getInvoice)
  .put(isStaff, updateInvoice);
router.post('/:id/payment', isStaff, recordPayment);

module.exports = router;