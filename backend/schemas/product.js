const mongoose = require('mongoose'); 

const productSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    perHandCost: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    reorderLevel: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date
    },
    updatedAt: {
        type: Date,
        default: new Date
    },
},
{
    versionKey: false
}) 
  
module.exports = mongoose.model("Product", productSchema);