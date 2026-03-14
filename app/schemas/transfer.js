const mongoose = require('mongoose'); 
const { Schema } = mongoose;

const transferSchema = new mongoose.Schema({ 
    fromWarehouse: {
        type: Schema.Types.ObjectId,
        required: true
    },
    toWarehouse: {
        type: Schema.Types.ObjectId,
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
  
module.exports = mongoose.model("transfer", transferSchema);