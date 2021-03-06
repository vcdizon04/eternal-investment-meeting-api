let meeTingSate = 'none';
let isMeetingTriggered = false;
let rollCallSte = false;
let presents = [];
let absents = [];

const setMeetingState = state => {
    meeTingSate = state;
    isMeetingTriggered = true;
}

const updateAbasents = () => {
    
}

const updateAbsentUser = (id, username, remarks) => {
    const index = absents.findIndex(user => user.username == username);
    const user = absents[index];
    user.remarks = remarks;
}

const getAllCurrentAbsents = () => {
    return absents;
}

const setAbsents = (data) => {
    absents = data;
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
    const user = presents[index];
    user.rollCall = true;
}

const resetRollcall = () => {
    presents = presents.map(user => {
        return {
            ...user,
            rollCall: false,
        }
    })
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
    rollCallSte = false;

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
    updateUser,
    resetRollcall,
    setAbsents,
    updateAbsentUser,
    getAllCurrentAbsents,
}