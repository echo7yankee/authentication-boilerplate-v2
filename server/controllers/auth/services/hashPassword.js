const bcrypt = require('bcryptjs');

async function hashPassword(password, confirmPassword) {
    try {
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt);

        return {
            hashedPassword,
            hashedConfirmPassword
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    hashPassword
}