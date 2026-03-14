const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../schemas/user');

exports.register = async (req, res) => {
    const { loginId, email, password } = req.body;

    if(!loginId || !email || !password) {
        return res.status(400).json({ status : "Error", error :"Missing Arugments." });
    }

    const loginIdUniqueCheck = await User.findOne({ loginId: loginId });

    if(loginIdUniqueCheck) return  res.status(200).json({ status : "Error", error :"Login Id Already Exist." });

    const emailUniqueCheck = await User.findOne({ email: email });

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

    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    let admin = false;
    let usersCount = await User.countDocuments();
    if(usersCount === 0) admin = true;

    const data = await User.create({
        loginId: loginId,
        email: email,
        role: admin?'primary-admin':"unverified",
        password: hashedPassword
    });

    const token = jwt.sign({_id : data._id } , `${process.env.JWT_SECRET}`);

    res.cookie("jwt" , token, {
        httpOnly : process.env.ENVIRONMENT === "dev" ? false : true,
        maxAge : 24 * 60 * 60 * 1000 * 30
    })

    return res.status(201).json({ status : "Success" });
}

exports.login = async (req, res) => {
    const { loginId, password } = req.body;

    if(!loginId || !password) {
        return res.status(400).json({ status : "Error", error :"Missing Arugments." });
    }

    const user = await User.findOne({ loginId: loginId });

    if(!user) return res.status(200).json({ status : "Error", error :"Invalid Login Id or Password." });

     if(!await bcrypt.compare(password , user.password)) {
        return res.status(200).json({ status : "Error", error :"Invalid Email or Password." });
    }

    const token = jwt.sign({_id : user._id } , `${process.env.JWT_SECRET}`)

    res.cookie("jwt" , token, {
        httpOnly : process.env.ENVIRONMENT === "dev" ? false : true,
        maxAge : 24 * 60 * 60 * 1000 * 30
    })


    return res.status(200).json({ status : "Success" });
}

exports.editRole = async(req, res) => {
    if(!["admin", "primary-admin"].includes(req.user.role)) {
        return res.status(401).json({ status: "Unauthorized", message: "Admin Access Only." });
    }

    let userId = req.body.userId;

    if(!userId) {
        return res.status(200).json({ status: "error", message: "Missing Arguments." });
    }

    let user = await User.findOne({ _id : userId });

    if(!user) {
        return res.status(200).json({ status: "error", message: "Invaild User ID." });
    }

    let { role } = req.body;

    let roles = ["staff", "admin", "manager"];

    if(!roles.includes(role)) {
        return res.status(200).json({ status: "error", message: "Invaild Role." });
    }

    await User.findOneAndUpdate({ _id : userId }, { role: role });

    return res.status(200).json({ status:"Success" });
}