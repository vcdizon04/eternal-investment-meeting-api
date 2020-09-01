const router = require('express').Router();
const {logIn, resetPassword } = require('../controllers/authController');

router.post('/login', logIn)
router.post('/reset', resetPassword)

module.exports = router;