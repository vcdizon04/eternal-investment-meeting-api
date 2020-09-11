const moment = require('moment');
const {getAttendanceByFullnameToday, addAttendance} = require('../services/QuickBaseService');
const Joi = require('@hapi/joi');

const stamp = async (req, res) => {

}

const getUserAttendanceToday = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string()
        .required(),
        password: Joi.optional()
    })

    // schema.validate(req.body, {abortEarly: false});

    const attendace = await getAttendanceByFullnameToday(req.params.userId);
    console.log(attendace.data);

    let response;

    if(attendace.data.data.length > 0) {
        response = {
            username: attendace.data.data[0]['11'].value,
            date: attendace.data.data[0]['6'].value,
            time: attendace.data.data[0]['13'].value,
            remarks: attendace.data.data[0]['8'].value,
        }
    }

    return res.json({
        data: response
    });    
}

const stampAttendance = async (req,res) => {
    try {
        const attendace = await addAttendance(req.params.userId, 'On Time');
        console.log(attendace)
        return res.json({
            message:attendace.data.metadata
        })
    } catch (error) {
        return res.status(400).json({
            message: "Error please try again later"
        })
    }
} 

module.exports = {
    getUserAttendanceToday,
    stampAttendance
}