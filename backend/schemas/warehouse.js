const mongoose = require('mongoose'); 
const { Schema } = mongoose;

const warehouseSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    managerId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    updatedAt: {
        type: Date,
        default: new Date
    }
},
{
    versionKey: false
}) 
  
module.exports = mongoose.model("Warehousr", warehouseSchema);