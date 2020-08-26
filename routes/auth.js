const router = require('express').Router();
const { register, logIn, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/login', logIn)

module.exports = router;