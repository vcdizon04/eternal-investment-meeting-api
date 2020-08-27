let meeTingSate = 'none';
let isMeetingTriggered = false;
let rollCallSte = false;
let presents = [];

const setMeetingState = state => {
    meeTingSate = state;
    isMeetingTriggered = true;
}

const getMeetingState = () => {
    return meeTingSate;
}

const setRollCallState = state => {
    rollCallSte = state;
}

const getRollCallState = () => {
    return rollCallSte;
}
const updateUser = (id) => {
    const index = presents.findIndex(user => user.id == id);
    console.log('index: ', index);
    const user = presents[index];
    user.rollCall = true;
}

const addPresentUser = (user) => {
    presents.push(user);
}

const getAllPresents = () => {
    return presents;
}

const getIsMeetingTriggered = () => {
    return isMeetingTriggered;
}

const adjournedMeeting = () => {
    meeTingSate = 'none';
    isMeetingTriggered = false;
    presents = [];

}

module.exports = {
    setMeetingState,
    getMeetingState,
    addPresentUser,
    getAllPresents,
    getIsMeetingTriggered,
    adjournedMeeting,
    setRollCallState,
    getRollCallState,
    updateUser
}