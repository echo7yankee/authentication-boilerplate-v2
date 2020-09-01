const jwt = require('jsonwebtoken');
const tokenConfig = require('./default.json');

async function createToken(payload) {
    try {
        return await jwt.sign(payload, process.env.TOKEN_SECRET, tokenConfig.options)
    } catch (error) {
        console.log(error);
    }
}

module.exports = { createToken };