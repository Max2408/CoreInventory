const Warehouse = require("../schemas/warehouse");
const Product = require("../schemas/product");
const Transfer = require("../schemas/transfer");
const Stock = require("../schemas/stock");
const StockMove = require("../schemas/stockMove");

exports.initiateTransfer = async (req, res) => {
    let { fromWarehouseId, toWarehouseId, products } = req.body;

    if(!fromWarehouseId || !toWarehouseId || !products) {
        return res.status(400).json({ status : "Error", error :"Missing Arugments." });
    }

    if(fromWarehouseId === toWarehouseId) {
        return res.status(400).json({ status : "Error", error :"Source and destination cannot be same." });
    }

    let fromWarehouse, toWarehouse
    try {
        fromWarehouse = await Warehouse.findOne({ _id : fromWarehouseId });
        toWarehouse = await Warehouse.findOne({ _id : toWarehouseId });
    }catch(e) {
            if(process.env.ENVIRONMENT === "dev") {
            console.log(`[-] ${e.message}`);
        }
    }

    if(!fromWarehouse || !toWarehouse) {
        return res.status(400).json({ status : "Error", error: "Invalid Warehouse ID." });
    }

    if(!Array.isArray(products)) {
        return res.status(400).json({ status : "Error", error: "Products must be an array." });
    }

    if(products.length === 0) {
        return res.status(400).json({ status : "Error", error: "Products can't be an empty." });
    }

    let productSchema = []

     for(let i = 0; i < products.length; i++) {
        if(!products[i].productId || !products[i].quantity) {
            return res.status(400).json({ status : "Error", error: "Missing Arguments." });
        }

        if(products[i].quantity < 0) {
            return res.status(400).json({ status : "Error", error: "Quantity can't be negative." });
        }

        let product

        try {
            product = await Product.findOne({ _id : products[i].productId });
        } catch(e) {
            if(process.env.ENVIRONMENT === "dev") {
                console.log(`[-] ${e.message}`);
            }
        }

        if(!product) {
            return res.status(400).json({ status : "Error", error: "Invaild Product ID." });
        }

        productSchema.push({
            productId: products[i].productId,
            quantity: products[i].quantity
        })
    }

    await Transfer.create({
        fromWarehouse: fromWarehouseId,
        toWarehouse: toWarehouseId,
        status: "draft",
        products: productSchema
    });
    
    return res.status(201).json({ status : "Success" });
}

exports.getTransfers = async (req, res) => {
    let pagination = req.query.page;
        
    if(pagination < 0) {
        return res.status(400).json({ status : "Error", error: "Pagination cannot be negative." });
    }

    if(!pagination) pagination = 1;

    const transfers = await Transfer.find().skip((pagination-1) * 20);

    return res.status(200).json({ status : "Success", data: transfers });
}

exports.validateTransfer = async(req, res) => {
    let id = req.params.id;
    
    const transfer = await Transfer.findOne({ _id : id });

    if(!transfer) {
        return res.status(404).json({ status : "Error", error: "Invaild transfer ID." });
    }

    if (transfer.status === "done" || transfer.status === "cancelled") {
        return res.status(400).json({ message: "Transfer already validated" });
    }

    for(let i = 0; i < transfer.products.length; i++) {
        let product

        try {
            product = await Product.findOne({ _id : transfer.products[i].productId });
        } catch(e) {
            if(process.env.ENVIRONMENT === "dev") {
                console.log(`[-] ${e.message}`);
            }
        }

        if(!product) {
            return res.status(400).json({ message: `Product with id: ${transfer.products[i].productId} Not Found.` });
        }

        let stock = await Stock.findOne({ productId: transfer.products[i].productId, warehouseId: transfer.fromWarehouse });

        if(!stock || stock.quantity < transfer.products[i].quantity) {
            return res.status(400).json({ message: `Insufficient stock for product with id: ${transfer.products[i].productId}` });
        }

        await Stock.findOneAndUpdate({ productId: transfer.products[i].productId, warehouseId: transfer.fromWarehouse }, {
            quantity: stock.quantity - transfer.products[i].quantity
        });

        let updatedStock = await Stock.findOne({ productId: transfer.products[i].productId, warehouseId: transfer.toWarehouse });

        if(!updatedStock) {
            await Stock.create({
                productId: transfer.products[i].productId,
                warehouseId: transfer.toWarehouse,
                quantity: transfer.products[i].quantity
            });
        } else {
            await Stock.findOneAndUpdate({ productId: transfer.products[i].productId, warehouseId: transfer.toWarehouse }, {
                quantity: updatedStock.quantity + transfer.products[i].quantity
            });
        }

        await StockMove.create({
            type: "transfer_out",
            productId: transfer.products[i].productId,
            warehouseId: transfer.fromWarehouse,
            quantityChange: `-${transfer.products[i].quantity}`,
            referenceId: transfer._id
        });

        await StockMove.create({
            type: "transfer_in",
            productId: transfer.products[i].productId,
            warehouseId: transfer.toWarehouse,
            quantityChange: `+${transfer.products[i].quantity}`,
            referenceId: transfer._id
        });
    }

    await Transfer.findOneAndUpdate({ _id : id }, { status: "done" });
    return res.status(200).json({ status : "Success" });
}

exports.cancelTransfer = async(req, res) => {
    const id = req.params.id;
    
    const transfer = await Transfer.findOne({  _id : id });

    if(!transfer) {
        return res.status(404).json({ status: "error", error: "Invaild Transfer ID."});
    }

    if(transfer.status === "done" || transfer.status === "cancelled") {
        return res.status(404).json({ status: "error", error: "Can't delete this transfer, it has been marked done."});
    }

    await Transfer.findOneAndUpdate({ _id : id }, { status : "cancelled" });

    return res.status(200).json({ status : "Success" });
}