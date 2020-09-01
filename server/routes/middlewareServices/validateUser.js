
const jwt = require('jsonwebtoken');

function validateUser(req, res, next) {
    const token = req.header('authentication-token');
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!decoded) {
        return res.status(400).json({ error: 'Invalid user' });
    }
    req.user = decoded.user;
    next();
}

module.exports = { validateUser }