const mongoose = require('mongoose');
const configMongo = require('./default.json');
const { GlobalConstants } = require('../../utils/GlobalConstants');

async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_CONNECT, configMongo.options, () => {
            console.log(GlobalConstants.LOGS.MONGOOSE_CONNECTED)
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connectDB }