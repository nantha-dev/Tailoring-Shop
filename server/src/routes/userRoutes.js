const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middlewares/auth');
const { getUsers, createUser, toggleUserStatus } = require('../controllers/userController');

router.use(verifyToken);
router.get('/', isAdmin, getUsers);
router.post('/', isAdmin, createUser);
router.patch('/:id/toggle-status', isAdmin, toggleUserStatus);

module.exports = router;