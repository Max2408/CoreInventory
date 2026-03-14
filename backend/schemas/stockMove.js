const mongoose = require('mongoose'); 
const { Schema } = mongoose;

const stockMoveSchemas = new mongoose.Schema({ 
    type: {
        type: String,
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    warehouseId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    quantityChange: {
        type: String,
        default: 0
    },
    referenceId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date
    }
},
{
    versionKey: false
});
  
module.exports = mongoose.model("StockMove", stockMoveSchemas);