const { HttpResponse } = require("../auth/httpResponse/httpResponse");
const { updateById } = require('../controllerServices/updateById');

class UserController extends HttpResponse {
    constructor(userModel) {
        super()
        this.userModel = userModel;

        this.getAuthenticatedUser = this.getAuthenticatedUser.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getOneUser = this.getOneUser.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.deleteOneUser = this.deleteOneUser.bind(this);
        this.deleteUserById = this.deleteUserById.bind(this);
        this.updateUserById = this.updateUserById.bind(this);
    }

    async getAuthenticatedUser(req, res) {
        try {
            const { id } = req.user;
            const user = await this.userModel.findById(id).select('-password').select('-confirmPassword');

            if (!user) {
                return this.buildFail(res, 401, { error: 'User not found' })
            }

            const processedUser = {
                ...user.toJSON(),
                id: user._id,
            }

            delete processedUser._id;

            return this.buildSuccess(res, 200, { user: processedUser })
        } catch (error) {
            console.log(error);
            return this.buildFail(res, 500, { error: 'Something went wrong with the server' })
        }
    }

    async getUsers(req, res) {
        try {
            const { params } = req.body;
            const users = await this.userModel.find(params).select('-password').select('-confirmPassword');

            if (!users) {
                return this.buildFail(res, 400, { error: 'Users not found' });
            }

            const processedUsers = users.map((user) => {
                const newUser = {
                    ...user.toJSON(),
                    id: user._id,
                }
                delete newUser._id;
                return newUser;
            })

            return this.buildSuccess(res, 200, { results: processedUsers.length, users: processedUsers })
        } catch (error) {
            console.log(error);
            return this.buildFail(res, 500, { error: 'Something went wrong with the server' })
        }
    }

    async getOneUser(req, res) {
        try {
            const { params } = req.body;

            //Stop here if params are empty. 
            if (!Object.values(params).length) {
                return this.buildFail(res, 400, { error: 'You must specify at least one parameter' });
            }

            //If someone wants to find by id, process it here to fit the backend. We do this so we don't send "_id" property from frontend
            if (params.id) {
                params._id = params.id;
                delete params.id;
            }

            const user = await this.userModel.findOne(params).select('-password').select('-confirmPassword');

            if (!user) {
                return this.buildFail(res, 400, { error: 'User not found' });
            }

            const processedUser = {
                ...user.toJSON(),
                id: user._id,
            }
            delete processedUser._id;

            return this.buildSuccess(res, 200, { users: processedUser })
        } catch (error) {
            console.log(error);
            return this.buildFail(res, 500, { error: 'Something went wrong with the server' })
        }
    }

    async getUserById(req, res) {
        try {
            const { userId } = req.params;

            const user = await this.userModel.findById(userId).select('-password').select('-confirmPassword');

            if (!user) {
                return this.buildFail(res, 400, { error: 'User not found' });
            }

            const processedUser = {
                ...user.toJSON(),
                id: user._id,
            }
            delete processedUser._id;

            return this.buildSuccess(res, 200, { users: processedUser })
        } catch (error) {
            console.log(error);
            return this.buildFail(res, 500, { error: 'Something went wrong with the server' })
        }
    }

    async deleteOneUser(req, res) {
        try {
            const { params } = req.body;
            if (!Object.values(params).length) {
                return this.buildFail(res, 400, { error: 'You must specify at least one parameter ' })
            }
            await this.userModel.deleteOne(params);
            return this.buildSuccess(res, 200, {})
        } catch (error) {
            console.log(error);
            return this.buildFail(res, 500, { error: 'Something went wrong with the server' })
        }
    }

    async deleteUserById(req, res) {
        try {
            const { userId } = req.params;
            const user = await this.userModel.findByIdAndRemove(userId);
            if (!user) {
                return this.buildFail(res, 400, { error: 'User not found' });
            }
            return this.buildSuccess(res, 200, {})
        } catch (error) {
            console.log(error);
            return this.buildFail(res, 500, { error: 'Something went wrong with the server' })
        }
    }

    async updateUserById(req, res) {
        try {
            const { userId } = req.params;

            let updatedUser = await updateById(userId, this.userModel, req.body)

            if (!updatedUser) {
                return this.buildFail(res, 400, { error: 'User not found' });
            }

            updatedUser = {
                ...updatedUser.toJSON(),
                id: updatedUser._id,
            }

            delete updatedUser.password;
            delete updatedUser.confirmPassword;
            delete updatedUser._id;
            updatedUser.userName = `${updatedUser.firstName} ${updatedUser.lastName}`;

            return this.buildSuccess(res, 200, { updatedUser })
        } catch (error) {
            console.log(error);
            return this.buildFail(res, 500, { error: 'Something went wrong with the server' })
        }
    }
}

module.exports = {
    UserController
}