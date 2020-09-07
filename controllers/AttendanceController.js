const moment = require('moment');
const {getAttendanceByFullnameToday} = require('../services/QuickBaseService');
const Joi = require('@hapi/joi');

const stamp = async (req, res) => {

}

const getUserAttendanceToday = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string()
        .required(),
        password: Joi.optional()
    })
    const attendace = await getAttendanceByFullnameToday();
    console.log(attendace);
    return res.json({});    
}

module.exports = {
    getUserAttendanceToday
}