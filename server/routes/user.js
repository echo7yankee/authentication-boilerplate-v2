const userRouter = require('express').Router();
const { userModel } = require('../databaseStorage/schemas/User');
const { UserController } = require('../controllers/user/user');
const { validateUser } = require('./middlewareServices/validateUser');
const { getAuthenticatedUser, getUsers, getOneUser, getUserById, deleteOneUser, deleteUserById, updateUserById } = new UserController(userModel);

userRouter.get('/', validateUser, getAuthenticatedUser);
userRouter.get('/many', getUsers);
userRouter.get('/one', getOneUser);
userRouter.get('/:userId', getUserById);
userRouter.delete('/', deleteOneUser);
userRouter.delete('/:userId', deleteUserById);
userRouter.put('/:userId', updateUserById);

module.exports = { userRouter }