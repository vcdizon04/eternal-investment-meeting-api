const { setMeetingState, getMeetingState } = require("../services/MeetingService");

const start = async (req, res) => {
    const io = req.app.get('socketio');
    setMeetingState(true);
    console.log('getMeetingState: ', getMeetingState());
    io.emit(`meeting/state`, getMeetingState());
    return res.json({
        message: "Meeting started successfully"
    })
}

module.exports = {
    start
}