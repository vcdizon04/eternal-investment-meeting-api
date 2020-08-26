const {
  errorMessage, status
} = require('../helpers/status');

module.exports = (...allowed) => {
    return (req, res, next) => {
        const userRoles = req.user.roles.split(',');
        // return res.json([
        //     userRoles,
        //     allowed
        // ])
        let isAllowed = false;
        userRoles.forEach(role => {
            if(allowed.indexOf(role) > -1)  isAllowed = true;
        });

        if(isAllowed) {
            next();
        } else {
            return res.status(status.unauthorized).json({message: "You don't have permission to access this"}); // user is forbidden
        }
    }
  }