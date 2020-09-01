const { HttpResponse } = require('./httpResponse/httpResponse');
const { validationResult } = require('express-validator');
const { hashPassword } = require('./services/hashPassword');
const { getAvatarDetails } = require('./services/getAvatarDetails');
const { createToken } = require('./tokenCreation/createToken');
const { getComparedPasswords } = require('./services/comparePasswords');

class AuthController extends HttpResponse {
    constructor(userModel) {
        super();
        this.userModel = userModel;

        this.createUser = this.createUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    async createUser(req, res) {
        try {
            //Throw errors if validation fails
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.buildFail(res, 400, { errors: errors.array() })
            }
            //The following return is the same format is the same as the !errors.isEmpty check
            if (req.body.password !== req.body.confirmPassword) {
                return this.buildFail(res, 400, {
                    errors: [
                        {
                            msg: "Passwords do not match",
                        }
                    ]
                })
            }

            //Process body with the hashed passwords
            const { hashedPassword, hashedConfirmPassword } = await hashPassword(req.body.password, req.body.confirmPassword);
            const body = {
                ...req.body,
                userName: `${req.body.firstName} ${req.body.lastName}`,
                password: hashedPassword,
                confirmPassword: hashedConfirmPassword,
                avatar: getAvatarDetails(req.body.email)
            }

            //Check if same email exists in the DB. If it exists, throw error
            const userExists = await this.userModel.findOne({ email: req.body.email });
            if (userExists) {
                return this.buildFail(res, 401, { error: 'This user already exists' })
            }

            //If everything is ok, save the user in the database
            const user = new this.userModel(body);
            if (user) {
                await user.save();
                const payload = {
                    user: {
                        id: user._id,
                    }
                }
                const token = await createToken(payload)
                res.header('authentication-token', `Bearer ${token}`);
                return this.buildSuccess(res, 200, { userId: user._id, token })
            }

        } catch (error) {
            console.log(error);
            return this.buildFail(res, 500, { error: 'Something went wrong with the server' })
        }
    }

    async loginUser(req, res) {
        try {
            //Throw errors if validation fails
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.buildFail(res, 400, { errors: errors.array() })
            }

            const user = await this.userModel.findOne({ email: req.body.email });

            if (!user) {
                return this.buildFail(res, 401, { error: 'Email or password is wrong' });
            }

            const isCorrectPassword = await getComparedPasswords(req.body.password, user.password);
            if (!isCorrectPassword) {
                return this.buildFail(res, 401, { error: 'Email or password is wrong' });
            }

            const payload = {
                user: {
                    id: user._id,
                }
            }

            const token = await createToken(payload)
            res.header('authentication-token', token);
            return this.buildSuccess(res, 200, { userId: user._id, token })

        } catch (error) {
            console.log(error);
            return this.buildFail(res, 500, { error: 'Something went wrong with the server' })
        }
    }

}

module.exports = {
    AuthController,
}