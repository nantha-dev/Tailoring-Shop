const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middlewares/auth');
const { getOrderReport, getRevenueReport, exportOrdersPDF, exportOrdersExcel } = require('../controllers/reportController');

router.use(verifyToken);
router.get('/orders', getOrderReport);
router.get('/revenue', getRevenueReport);
router.get('/export/orders/pdf', isAdmin, exportOrdersPDF);
router.get('/export/orders/excel', isAdmin, exportOrdersExcel);

module.exports = router;