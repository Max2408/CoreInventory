const jwt = require('jsonwebtoken')

//Schemas
const User = require('../schemas/user')

exports.protectedAuth = async (req, res, next) => {
    let token = req.cookies['jwt'];

    if(!token) {
        return res.status(401).json({ status: "Unauthorized", message: "Login or Register before accessing this."})
    }

    let user = await jwt.verify(token, process.env.JWT_SECRET);

    if(!user) {
        return res.status(401).json({ status: "Unauthorized", message: "Login or Register before accessing this."})
    }

    let matchUser = await User.findOne({ _id : user._id });

    if(!matchUser) {
        return res.status(401).json({ status: "Unauthorized", message: "Login or Register before accessing this."})
    }

    if(matchUser.role === "unverified") {
        return res.status(401).json({ status: "Unauthorized", message: "Your Account is Unverified."});
    }

    req.user = matchUser

    return next();
}