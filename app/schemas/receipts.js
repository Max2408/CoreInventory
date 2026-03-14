const mongoose = require('mongoose'); 
const { Schema } = mongoose;

const receiptSchema = new mongoose.Schema({ 
    warehouseId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    supplier: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    products: [{
        _id: false,
        productId: {
            type: Schema.Types.ObjectId,
            required: true
        }, 
        quantity: {
            type: Number,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: new Date
    },
    updatedAt: {
        type: Date,
        default: new Date
    }
},
{
    versionKey: false
});
  
module.exports = mongoose.model("receipts", receiptSchema);