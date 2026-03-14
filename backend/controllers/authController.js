const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../schemas/user');

exports.register = async (req, res) => {
    let { loginId, email, password } = req.body;

    if(!loginId || !email || !password) {
        return res.status(400).json({ status : "Error", error :"Missing Arugments." });
    }

    let loginIdUniqueCheck = await User.findOne({ loginId: loginId });

    if(loginIdUniqueCheck) return  res.status(200).json({ status : "Error", error :"Login Id Already Exist." });

    let emailUniqueCheck = await User.findOne({ email: email });

    if(emailUniqueCheck) return  res.status(200).json({ status : "Error", error :"Email Already Exist." });

    if(password.length < 8) {
        return  res.status(400).json({ status : "Error", error :"Password Must be at least 8 characters long." });
    }

    if(loginId.length < 6 || loginId.length > 12) {
        return  res.status(400).json({ status : "Error", error :"Login Id must be between 6 to 12 characters." });
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

    if(!regex.test(password)) {
        return  res.status(400).json({ status : "Error", error :"Password must contain atleast 1 number, 1 small case, 1 large case and a special character." });
    }

    let salt = await bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);

    let data = await User.create({
        loginId: loginId,
        email: email,
        password: hashedPassword
    });

    const token = jwt.sign({_id : data._id } , `${process.env.JWT_SECRET}`);

    res.cookie("jwt" , token, {
        httpOnly : process.env.ENVIRONMENT === "dev" ? false : true,
        maxAge : 24 * 60 * 60 * 1000 * 30
    })

    return res.status(200).json({ status : "Success" });
}