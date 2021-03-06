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

    try {

        let response;

        if(attendace.data.data.length <= 0) {
            return res.json("No attendance");    
        }

        response = {
            username: attendace.data.data[0]['11'].value,
            date: attendace.data.data[0]['6'].value,
            time: attendace.data.data[0]['13'].value,
            remarks: attendace.data.data[0]['8'].value,
        }
        return res.json({
            data: response
        });    

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Error please try again later"
        })
    }

}

const stampAttendance = async (req,res) => {
    try {
        const attendace = await addAttendance(req.params.userId, 'On Time');
        return res.json({
            message: 'Successfully stamped in'
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