const { setMeetingState, getMeetingState, getAllPresents, addPresentUser, getIsMeetingTriggered, adjournedMeeting, setRollCallState, getRollCallState, updateUser, resetRollcall, setAbsents, getAllCurrentAbsents } = require("../services/MeetingService");
const { getAllAbsents, getAttendanceByFullname, updateAttendance, getAllAttendance, updateAbsentsAttendance, addRemarks } = require("../services/QuickBaseService");

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
    const attendances = await getAllAttendance();
    const absentsAttendance = attendances.data.data.filter(attendance => (getAllPresents().findIndex(present => present.username !== attendance['6'].value) > -1) )
    console.log('getAllAttendance: ', absentsAttendance)
    let absentIds = [];
    absentsAttendance.forEach(absent => {
        const schedule = absent['22'].value.replace(/\s/g, "").split('-');
        let start, end;
        if( schedule[0].includes('pm')) {
            start = parseFloat(schedule[0]) + 12;
        } else {
            start = parseFloat(schedule[0]);
            if(start == 12) start = start - 12;
        }

        if( schedule[1].includes('pm')) {
            end = parseFloat(schedule[1]) + 12;
        } else {
            end = parseFloat(schedule[1]);
            if(end == 12) end = end - 12;
        }
        let start_time 	= [start,00]
        let end_time 	= [end,00]
        //We've got the two start times as an array of hours/minutes values.
        let dateObj 	= new Date(); //I just feel dirty making multiple calls to new Date().etc
        let now 		= [dateObj.getHours(),dateObj.getMinutes()]; //Gets the current Hours/Minutes 
        if(end_time[0] < start_time[0] && now[0] < start_time[0]){
            start_time[0] -= 24; //This is something I came up with because I do a lot of math.
        }else if(start_time[0] > end_time[0]){
            end_time[0]+=24;
        }
        let start_string = to_hms_string(start_time); //the start string converted to a string format. Made comparisons easier.
        let end_string = to_hms_string(end_time); //See Above
        let now_string = to_hms_string(now); //Above
        console.log(start_string, now_string, end_string);
        let status = (start_string <= now_string && now_string <= end_string) 
        console.log("status: ", status);
        if(status)  absentIds.push(absent['3'].value);

    })
    console.log('absentIds: ', absentIds);
    if(absentIds.length > 0) await updateAbsentsAttendance(absentIds);
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
    io.emit(`meeting/rollcall/state`, getRollCallState());
    io.emit(`meeting/state`, getMeetingState());
    io.emit(`meeting/users`, getAllPresents())
    return res.json({
        message: "Meeting adjourned successfully"
    })
}


const stamp = async (req, res) => {
    const result = await getAttendanceByFullname(req.body.username);
    let latestAttendanceId = 0;
    result.data.data.forEach(attendance => {
        console.log("attendance['3'].value :", attendance['3'].value)
        if(attendance['3'].value > latestAttendanceId) latestAttendanceId = attendance['3'].value
    });
    console.log('latesAttendanceId: ', latestAttendanceId);
    await updateAttendance(latestAttendanceId);
    const io = req.app.get('socketio');
    console.log(req.body);
    addPresentUser(req.body);
    console.log(' getAllPresents(): ',  getAllPresents())
    io.emit(`meeting/users`, getAllPresents())
    return res.json({
        message: "Stamp successfully"
    })
}

const addAbsentRemarks = async (req, res) => {
    const result = await getAttendanceByFullname(req.body.username);
    let latestAttendanceId = 0;
    result.data.data.forEach(attendance => {
        console.log("attendance['3'].value :", attendance['3'].value)
        if(attendance['3'].value > latestAttendanceId) latestAttendanceId = attendance['3'].value
    });
    console.log('latesAttendanceId: ', latestAttendanceId);
    await addRemarks(latestAttendanceId, req.body.username, req.body.remarks);
    const io = req.app.get('socketio');
    io.emit(`meeting/absents`, getAllCurrentAbsents())
    return res.json({
        message: "Remarks added successfully"
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
            isMeetingTriggered: getIsMeetingTriggered(),
            rollCallState: getRollCallState()
        }
    })
}

const getAbsents =  async (req, res) => {
    if(getAllCurrentAbsents().length > 0) {
        const absents = getAllCurrentAbsents().filter(user => (getAllPresents().findIndex(present => present.id == user.id) < 0))
        return res.json({
            data: absents
        })
    }
    let absents = await getAllAbsents();
    absents = absents.data.data.filter(user => (getAllPresents().findIndex(present => present.id == user['3'].value) < 0))
    absents = absents.map(user => {
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
    console.log('setAbsents(absents): ', absents)
    setAbsents(absents);
    return res.json({
        data: absents
    })
}

const rollCall =  async (req, res) => {
    const io = req.app.get('socketio');
    resetRollcall();    
    setRollCallState(true);
    io.emit(`meeting/users`, getAllPresents())
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

const to_hms_string = (timearr) => {
    let minutes = timearr[1];
    let hours = "";
    if(Math.abs(timearr[0]) < 10){
      hours = "0";
    }
    hours = (timearr[0]<0) ? "-"+hours+Math.abs(timearr[0]) : hours+timearr[0];
    return hours+":"+minutes;
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
    setUserRollCallStatus,
    addAbsentRemarks
}