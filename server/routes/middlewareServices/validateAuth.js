const { check } = require('express-validator');

function validateRegister() {
    return [
        check('firstName', 'First name is empty').not().isEmpty(),
        check('lastName', 'Last name is empty').not().isEmpty(),
        check('email', 'Not valid email').isEmail(),
        check('password', 'Password must contain at least 6 characters').isLength({ min: 6, max: 50 }),
    ]
}

function validateLogin() {
    return [
        check('email', 'Not valid email').isEmail(),
        check('password', 'Password must contain at least 6 characters').isLength({ min: 6, max: 50 }),
    ]
}

module.exports = {
    validateRegister,
    validateLogin,
}