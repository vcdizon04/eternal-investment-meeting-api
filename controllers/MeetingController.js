const { setMeetingState, getMeetingState, getAllPresents, addPresentUser, getIsMeetingTriggered, adjournedMeeting, setRollCallState, getRollCallState, updateUser } = require("../services/MeetingService");
const { getAllAbsents } = require("../services/QuickBaseService");

const start = async (req, res) => {
    const io = req.app.get('socketio');
    setMeetingState('start');
    console.log('getMeetingState: ', getMeetingState());
    io.emit(`meeting/state`, getMeetingState());
    return res.json({
        message: "Meeting started successfully"
    })
}

const stop = async (req, res) => {
    const io = req.app.get('socketio');
    setMeetingState('late');
    console.log('getMeetingState: ', getMeetingState());
    io.emit(`meeting/state`, getMeetingState());
    return res.json({
        message: "Meeting stopped successfully"
    })
}

const end = async (req, res) => {
    const io = req.app.get('socketio');
    setMeetingState('end');
    console.log('getMeetingState: ', getMeetingState());
    io.emit(`meeting/state`, getMeetingState());
    return res.json({
        message: "Meeting ended successfully"
    })
}

const late = async (req, res) => {
    const io = req.app.get('socketio');
    setMeetingState('late-start');
    console.log('getMeetingState: ', getMeetingState());
    io.emit(`meeting/state`, getMeetingState());
    return res.json({
        message: "Late entry started successfully"
    })
}

const adjourned = async (req, res) => {
    const io = req.app.get('socketio');
    adjournedMeeting();
    io.emit(`meeting/state`, getMeetingState());
    io.emit(`meeting/users`, getAllPresents())
    return res.json({
        message: "Meeting adjourned successfully"
    })
}


const stamp = async (req, res) => {
    const io = req.app.get('socketio');
    console.log(req.body);
    addPresentUser(req.body);
    console.log(' getAllPresents(): ',  getAllPresents())
    io.emit(`meeting/users`, getAllPresents())
    return res.json({
        message: "Stamp successfully"
    })
}

const stampLate = async (req, res) => {
    const io = req.app.get('socketio');
    console.log(req.body);
    addPresentUser({
        ...req.body,
        isLate: true
    });
    console.log(' getAllPresents(): ',  getAllPresents())
    io.emit(`meeting/users`, getAllPresents())
    return res.json({
        message: "Stamp successfully"
    })
}


const getAllPresentUsers = async (req, res) => {
    return res.json({
        data: getAllPresents()
    })
}

const getState = async (req, res) => {
    return res.json({
        data: getMeetingState()
    })
}

const getMeeting = async (req, res) => {
    return res.json({
        data: {
            state: getMeetingState(),
            users: getAllPresents(),
            isMeetingTriggered: getIsMeetingTriggered()
        }
    })
}

const getAbsents =  async (req, res) => {
    let absents = await getAllAbsents();
    console.log(absents.data);
    absents = absents.data.data.map(user => {
        return {
            username:user['6'].value,
            team:user['9'].value,
            id:user['3'].value,
            employee_level:user['60'].value,
            transition:user['269'].value,
            schedule:user['19'].value,
            status:user['13'].value,
        }
    })
    return res.json({
        data: absents
    })
}

const rollCall =  async (req, res) => {
    const io = req.app.get('socketio');
    setRollCallState(true);
    io.emit(`meeting/rollcall/state`, getRollCallState());
    return res.json({
        data: getRollCallState(),
        message: "Roll Call started successfully"
    })
}

const stopRollCall =  async (req, res) => {
    const io = req.app.get('socketio');
    setRollCallState(false);
    io.emit(`meeting/rollcall/state`, getRollCallState());
    return res.json({
        data: getRollCallState(),
        message: "Roll Call stopped successfully"
    })
}

const setUserRollCallStatus =  async (req, res) => {
    const io = req.app.get('socketio');
    updateUser(req.params.userId)
    io.emit(`meeting/users`, getAllPresents())
    return res.json({
        message: "Success"
    })
}

module.exports = {
    start,
    stamp,
    getAllPresentUsers,
    getState,
    stop,
    getMeeting,
    late,
    end,
    getAbsents,
    adjourned,
    rollCall,
    stopRollCall,
    setUserRollCallStatus
}