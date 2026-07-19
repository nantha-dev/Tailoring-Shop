const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth');
const { getDashboardStats } = require('../controllers/dashboardController');

router.get('/', verifyToken, getDashboardStats);

module.exports = router;