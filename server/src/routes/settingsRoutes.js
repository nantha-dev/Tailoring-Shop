const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middlewares/auth');
const { getSettings, updateSettings } = require('../controllers/settingsController');

router.get('/', verifyToken, getSettings);
router.put('/', verifyToken, isAdmin, updateSettings);

module.exports = router;