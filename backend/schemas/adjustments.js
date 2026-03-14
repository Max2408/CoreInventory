const mongoose = require('mongoose'); 
const { Schema } = mongoose;

const adjustmentSchema = new mongoose.Schema({ 
    productId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    warehouseId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    countedQuantity: {
        type: Number,
        required: true
    },
    systemQuantity: {
        type: Number,
        required: true
    },
    difference: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    }
},
{
    versionKey: false
});
  
module.exports = mongoose.model("Adjustment", adjustmentSchema);