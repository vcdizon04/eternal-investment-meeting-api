const { User, Category } = require('../models');
const Joi = require('@hapi/joi');
const { errorMessage, successMessage, status } = require('../helpers/status');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { string } = require('@hapi/joi');
const { v4: uuidv4 } = require('uuid');
const { getUser, updatePassword } = require('../services/QuickBaseService');

const logIn = async (req, res) => {
    const body = req.body;
    const schema = Joi.object({
        username: Joi.string()
        .required(),
        password: Joi.optional()
    })

    const validation = schema.validate(body, {abortEarly: false});

    if(validation.error) {
        return res.status(status.bad).json(validation.error.details)
    }

    try {
        const user  = await getUser(body);
        if(user.data.data.length == 0) {
            return res.status(status.notfound).json({
                message: "Username is not found"
            })
        }

        const payload = {
            user_id: user.data.data[0]['3'].value,
            team: user.data.data[0]['9'].value,
            
        }
        console.log(payload);
        const token = jwt.sign(payload, process.env.TOKEN_SECRET);

        if(!user.data.data[0]['14'].value) {
            return res.json({
                access_token: token,
                username: user.data.data[0]['6'].value,
                team: user.data.data[0]['9'].value,
                id: user.data.data[0]['3'].value,
                employee_level: user.data.data[0]['60'].value,
                transition: user.data.data[0]['269'].value,
                schedule: user.data.data[0]['19'].value,
                status: user.data.data[0]['13'].value,
                attendance_id:user.data.data[0]['119'].value,
                change_passwod: true,
            })
        }

        if(user.data.data[0]['14'].value !== body.password) {
            return res.status('401').json({
                message: "Invalid username or password"
            })
        }
        
        return res.json({
            access_token: token,
            username: user.data.data[0]['6'].value,
            team: user.data.data[0]['9'].value,
            id: user.data.data[0]['3'].value,
            employee_level: user.data.data[0]['60'].value,
            transition: user.data.data[0]['269'].value,
            schedule: user.data.data[0]['19'].value,
            status: user.data.data[0]['13'].value,
            attendance_id:user.data.data[0]['119'].value,
        });
        

    } catch (error) {
        console.error(error);
        return res.status(status.error).json(error);
    }
}


const resetPassword = async (req, res) => {
    const body = req.body;
    const schema = Joi.object({
        password: Joi.string()
        .required(),
        password_confirmation: Joi.any().valid(Joi.ref('password')).required()
    })

    const validation = schema.validate(body, {abortEarly: false});

    if(validation.error) {
        return res.status(status.bad).json(validation.error.details)
    }
    const token =  req.header('token')
    console.log('token: ', token)

    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(payload);

    try {
        const user = await updatePassword(payload.user_id, body.password);
        return res.json({
            message: "Password updated successfully"
        })

    } catch (error) {
        console.error(error);
        return res.status(status.error).json(error);
    }
}


module.exports = {
    logIn,
    resetPassword
}