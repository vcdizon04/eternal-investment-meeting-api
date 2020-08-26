const { start } = require("../controllers/MeetingController");

let isMeetingStarted = false;
let presents = [];

const setMeetingState = state => {
    isMeetingStarted = state;
}

const getMeetingState = () => {
    return isMeetingStarted;
}

module.exports = {
    setMeetingState,
    getMeetingState
}