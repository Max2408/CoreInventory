const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({ 
    loginId: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: "unverified"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date
    }
},
{
    versionKey: false
}) 
  
module.exports = mongoose.model("User", userSchema);