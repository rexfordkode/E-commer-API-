const User = require('../models/User')

moduel.export = async function (req, res, next) {
    //Get User information by id
    try {
        const user = await User.findOne({
            id: req.user.id
        })
        if (user.role === 0) {
            return res.status(403).json({
                error: 'Admin resources access denied'
            })
        }
        next()
    } catch (error) {
        console.log(error)
        req.status().json({
            msg: 'Server errors'
        })
    }
}