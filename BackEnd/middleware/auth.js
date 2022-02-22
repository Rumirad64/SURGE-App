const jwt = require('jsonwebtoken');


//! authenticattion middleware
const Authorize = () => {
    return (req, res, next) => {
        //verify x-auth-token via jwt
        const token = req.headers[process.env.AUTH_HEADER_NAME];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' })
        } else {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;   //put decoded data into req.user to achieve authorization
                console.log(`user -> ${req.user._id} is authenticated with token`);
                next();
            } catch (err) {
                res.status(401).json({ message: 'Unauthorized' })
            }
        }
    }
}

exports.Authorize = Authorize;

