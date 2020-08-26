const { User, Category } = require('../models');
const Joi = require('@hapi/joi');
const { errorMessage, successMessage, status } = require('../helpers/status');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { string } = require('@hapi/joi');
const { v4: uuidv4 } = require('uuid');
const { getUser } = require('../services/QuickBaseService');

const logIn = async (req, res) => {
    const body = req.body;
    const schema = Joi.object({
        username: Joi.string()
        .required(),
        password: Joi.string()
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
                username: !user.data.data[0]['6'].value,
                team: user.data.data[0]['9'].value,
                change_passwod: true
            })
        }
        
        return res.json({
            access_token: token,
            username: user.data.data[0]['6'].value,
            team: user.data.data[0]['9'].value,
        });
        

    } catch (error) {
        console.error(error);
        return res.status(status.error).json(error);
    }
}


module.exports = {
    logIn,
}