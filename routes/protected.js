const authenticate = require('../middlewares/verifyAuth')
const roles = require('../middlewares/verifyPermission');
const { start, stamp, getAllPresentUsers, getState, stop, getMeeting, late, getAbsents, end, adjourned, rollCall, stopRollCall, setUserRollCallStatus, addAbsentRemarks, } = require('../controllers/MeetingController');
const { route } = require('./auth');
const { getUserAttendanceToday } = require('../controllers/AttendanceController');
const router = require('express').Router();



// Routes

//meeting

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
router.post('/meeting/absents/remarks', addAbsentRemarks);


//daily-attendance
router.get('/attendance', getUserAttendanceToday)

module.exports = router;