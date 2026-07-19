const router = require('express').Router();
const { register, login, logout, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { registerValidator, loginValidator, changePasswordValidator } = require('../validators/authValidator');
const validate = require('../middlewares/validate');
const { verifyToken } = require('../middlewares/auth');

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/logout', logout);
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePasswordValidator, validate, changePassword);

module.exports = router;