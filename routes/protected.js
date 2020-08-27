const authenticate = require('../middlewares/verifyAuth')
const roles = require('../middlewares/verifyPermission');
const { start, stamp, getAllPresentUsers, getState, stop, getMeeting, late, getAbsents, end, adjourned, rollCall, stopRollCall, setUserRollCallStatus } = require('../controllers/MeetingController');
const router = require('express').Router();



// Routes

router.post('/meeting/start',  start);
router.post('/meeting/stop',  stop);
router.post('/meeting/late',  late);
router.post('/meeting/end',  end);
router.post('/meeting/users',  stamp);
router.get('/meeting',  getMeeting);
router.get('/meeting/users',  getAllPresentUsers);
router.get('/meeting/state',  getState);
router.get('/meeting/absents',  getAbsents);
router.post('/meeting/adjourned',  adjourned);
router.post('/meeting/roll-call/start',  rollCall);
router.post('/meeting/roll-call/stop',  stopRollCall);
router.put('/meeting/roll-call/users/:userId',  setUserRollCallStatus);

module.exports = router;