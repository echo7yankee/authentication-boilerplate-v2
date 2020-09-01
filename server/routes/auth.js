const authRouter = require('express').Router();
const { userModel } = require('../databaseStorage/schemas/User');
const { AuthController } = require('../controllers/auth/auth');
const { createUser, loginUser } = new AuthController(userModel);
//Middleware
const { validateRegister, validateLogin } = require('./middlewareServices/validateAuth');


authRouter.post('/register', validateRegister(), createUser);
authRouter.post('/login', validateLogin(), loginUser);

module.exports = { authRouter }