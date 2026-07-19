const router = require('express').Router();
const { verifyToken, isStaff } = require('../middlewares/auth');
const { createOrder, getOrders, getOrder, updateOrder, deleteOrder, getOrderHistory } = require('../controllers/orderController');
const { createOrderValidator, updateOrderValidator } = require('../validators/orderValidator');
const validate = require('../middlewares/validate');

router.use(verifyToken);
router.get('/history', getOrderHistory);
router.route('/')
  .get(getOrders)
  .post(isStaff, createOrderValidator, validate, createOrder);
router.route('/:id')
  .get(getOrder)
  .put(isStaff, updateOrderValidator, validate, updateOrder)
  .delete(isStaff, deleteOrder);

module.exports = router;