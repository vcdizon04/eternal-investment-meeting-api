const authenticate = require('../middlewares/verifyAuth')
const roles = require('../middlewares/verifyPermission');
const { start } = require('../controllers/MeetingController');
const router = require('express').Router();



// Routes

router.post('/meeting/start',  start);

module.exports = router;