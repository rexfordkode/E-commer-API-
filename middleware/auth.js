const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    //Check if no token
    if (!token) {
        return res.status(403).json({
            msg: 'No token, auth denied'
        })
    }
    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // set user id in req.users
        req.user = decoded.user;
        next();

    } catch (err) {
        req.status(403).json({
            msg: 'Token is not valid'
        })
    }

}