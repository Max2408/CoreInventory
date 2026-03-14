const Delivery = require("../schemas/delivery");
const Product = require("../schemas/product");
const Stock = require("../schemas/stock");
const Receipt = require("../schemas/receipts");
const Transfer = require("../schemas/transfer");

const config = require('../config.json')

exports.kpis = async(req, res) => {
    const totalProducts = await Product.countDocuments();

    const pendingReceipts = await Receipt.countDocuments({
        status: { $in: ["draft"] }
    });

    const pendingDeliveries = await Delivery.countDocuments({
        status: { $in: ["draft"] }
    });

    const scheduledTransfers = await Transfer.countDocuments({
        status: { $in: ["draft"] }
    });

    const lowStockItems = await Stock.countDocuments({
        quantity:{ $lte: config.RE_ORDER_LEVEL }
    });

    return res.json({
        totalProducts,
        lowStockItems,
        pendingReceipts,
        pendingDeliveries,
        scheduledTransfers
    });
}