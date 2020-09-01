const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./databaseStorage/config');
const { GlobalConstants } = require('./utils/GlobalConstants');
//Init app
const app = express();

//use json conversion
app.use(express.json());
//prevent cors policy
app.use(cors());
//config dotenv
dotenv.config();
//connect to db
connectDB();
//routes
const { authRouter } = require('./routes/auth');
const { userRouter } = require('./routes/user');
//use routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

const PORT = 5000 || process.env.PORT

app.listen(PORT, () => {
    console.log(`${GlobalConstants.LOGS.SERVER_STARTED}${PORT}`)
})