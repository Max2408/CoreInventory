const mongoose = require('mongoose'); 
const { Schema } = mongoose;

const stockSchemas = new mongoose.Schema({ 
    productId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    warehouseId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: new Date
    }
},
{
    versionKey: false
});
  
module.exports = mongoose.model("Stock", stockSchemas);