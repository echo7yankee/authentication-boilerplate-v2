const bcrypt = require('bcryptjs');

async function getComparedPasswords(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getComparedPasswords,
}