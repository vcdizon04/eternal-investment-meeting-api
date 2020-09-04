const moment = require('moment');

const stamp = async (req, res) => {

}

const getUserAttendanceToday = async (req, res) => {
    const attendace = await getAttendanceByFullnameToday();
    console.log(attendace);
    return res.json({});    
}


module.exports = {
    getUserAttendanceToday
}