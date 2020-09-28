const jwt = require('jsonwebtoken');
const keys = require("../../config/keys");
const User = require("../../models/UserSchema");

module.exports = async (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = await jwt.verify(token, keys.secretOrKey);
            const userId = decodedToken.id;

            const user = await User.findOne({_id: userId});
            if (user && user._id) {
                if (req.baseUrl.includes("lessons") && (req.method === 'POST' || req.method === 'PUT')) {
                    if (user.userType === 'TEACHER') {
                        next();
                    } else {
                        res.status(400).json({
                            message: 'Unauthorized'
                        });
                    }
                } else {
                    next();
                }
            } else {
                res.status(400).json({
                    message: 'Invalid User'
                });
            }
        } else {
            res.status(400).json({
                message: 'User is not loggedIn'
            });
        }
    } catch (err) {
        console.log('err', err);
        res.status(401).json({
        message: 'Invalid request!'
    });
}
};