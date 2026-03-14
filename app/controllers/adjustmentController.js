const Stock = require("../schemas/stock");
const Adjustment = require("../schemas/adjustments")
const StockMove = require("../schemas/stockMove");

exports.createAdjustment = async(req, res) => {
    let { productId, warehouseId, countedQuantity, reason } = req.body;

    if(!productId || !warehouseId || !countedQuantity || !reason) {
        return res.status(400).json({ status : "Error", error :"Missing Arugments." });
    }

    const stock = await Stock.findOne({ productId: productId, warehouseId: warehouseId });

    if(!stock) {
        return res.status(404).json({ status : "Error", error :"No Stock found." });
    }

    const difference = stock.quantity - countedQuantity;

    await Stock.findOneAndUpdate({ _id : stock._id }, {
        quantity: countedQuantity
    });

    let data = await Adjustment.create({
        productId: productId,
        warehouseId: warehouseId,
        systemQuantity: stock.quantity,
        countedQuantity: countedQuantity,
        difference: difference,
        reason: reason
    });

    await StockMove.create({
        type:"adjustment",
        productId: productId,
        warehouseId: warehouseId,
        quantityChange: difference,
        referenceId: data._id
    });

    return res.status(201).json({ status:"Success" });
}

exports.getAllAdjustments = async(req, res) => {
    let pagination = req.query.page;
            
    if(pagination < 0) {
        return res.status(400).json({ status : "Error", error: "Pagination cannot be negative." });
    }

    if(!pagination) pagination = 1;

    const adjustments = await Adjustment.find().skip((pagination-1) * 20);

    return res.status(200).json({ status : "Success", data: adjustments });
}