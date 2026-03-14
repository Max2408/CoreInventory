const Warehouse = require("../schemas/warehouse");
const Product = require("../schemas/product");
const Stock = require("../schemas/stock");
const Receipts = require("../schemas/receipts");
const StockMove = require("../schemas/stockMove");

exports.createOrder = async (req, res) => {
    let { warehouseId, products, supplier } = req.body;

    if(!warehouseId || !products || !supplier) {
        return res.status(400).json({ status : "Error", error :"Missing Arugments." });
    }

    let warehouse
    try {
        warehouse = await Warehouse.findOne({ _id : warehouseId });
    }catch(e) {
         if(process.env.ENVIRONMENT === "dev") {
            console.log(`[-] ${e.message}`);
        }
    }

    if(!warehouse) {
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

    await Receipts.create({
        supplier: supplier,
        warehouseId: warehouseId,
        status: "draft",
        products: productSchema
    });
  
    return res.status(201).json({ status : "Success" });
}

exports.updateOrder = async(req, res) => {
    const id = req.params.id;
    const { supplier, warehouseId, products } = req.body;

    const receipt = await Receipts.findOne({ _id : id });

    if(!receipt) {
        return res.status(404).json({ status : "Error", error: "Invaild receipt ID." });
    }

    if(receipt.status === "done" || receipt.status === "cancelled") {
        return res.status(400).json({ status : "Error", error: "Can't Edit this receipt, order has been marked done or cancelled." });
    }

    if(warehouseId) {
        let warehouse
        try {
            warehouse = await Warehouse.findOne({ _id: warehouseId });
        } catch(e) {
            if(process.env.ENVIRONMENT === "dev") {
                console.log(`[-] ${e.message}`);
            }
        }
        

        if(!warehouse) {
            return res.status(400).json({ status : "Error", error: "Invalid WarehouseId." });
        }
    }

    let productSchema = [];
    
    if(products) {
        if(!Array.isArray(products)) {
            return res.status(400).json({ status : "Error", error: "Products must be an array." });
        }

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
    }

    await Receipts.findOneAndUpdate({ _id : id }, {
        supplier: supplier?supplier:receipt.supplier,
        warehouseId: warehouseId?warehouseId:receipt.warehouseId,
        products:products?productSchema:receipt.products,
        updatedAt: new Date
    });
    
    return res.status(200).json({ status : "Success" });
}

exports.validateOrder = async(req, res) => {
    let id = req.params.id;

    const receipt = await Receipts.findOne({ _id : id });

    if(!receipt) {
        return res.status(404).json({ status : "Error", error: "Invaild receipt ID." });
    }

    if (receipt.status === "done" || receipt.status === "cancelled") {
        return res.status(400).json({ message: "Receipt already validated" });
    }

    for(let i = 0; i < receipt.products.length; i++) {
        let product

        try {
            product = await Product.findOne({ _id : receipt.products[i].productId });
        } catch(e) {
            if(process.env.ENVIRONMENT === "dev") {
                console.log(`[-] ${e.message}`);
            }
        }

        if(!product) {
            return res.status(400).json({ message: `Product with id: ${receipt.products[i].productId} Not Found.` });
        }

        let stock = await Stock.findOne({ productId: receipt.products[i].productId, warehouseId: receipt.warehouseId });

        if(!stock) {
            await Stock.create({
                productId: receipt.products[i].productId,
                warehouseId: receipt.warehouseId,
                quantity: receipt.products[i].quantity
            });
        } else {
            await Stock.findOneAndUpdate({ productId: receipt.products[i].productId, warehouseId: receipt.warehouseId }, {
                quantity: stock.quantity + receipt.products[i].quantity
            });
        }

        await StockMove.create({
            type: "receipt",
            productId: receipt.products[i].productId,
            warehouseId: receipt.warehouseId,
            quantityChange: `+${receipt.products[i].quantity}`,
            referenceId: receipt._id
        });
    }


    await Receipts.findOneAndUpdate({ _id : id }, { status: "done" });
    return res.status(200).json({ status : "Success" });
}

exports.getAllreceipts = async(req, res) => {
    let pagination = req.query.page;
    
    if(pagination < 0) {
        return res.status(400).json({ status : "Error", error: "Pagination cannot be negative." });
    }

    if(!pagination) pagination = 1;

    const receipts = await Receipts.find().skip((pagination-1) * 20);

    return res.status(200).json({ status : "Success", data: receipts });
}

exports.deleteReceipt = async(req, res) => {
    const id = req.params.id;

    const receipt = await Receipts.findOne({  _id : id });

    if(!receipt) {
        return res.status(404).json({ status: "error", error: "Invaild Receipt ID."});
    }

    if(receipt.status === "done" || receipt.status === "cancelled") {
        return res.status(404).json({ status: "error", error: "Can't delete this receipt, it has been marked done."});
    }

    await Receipts.findOneAndUpdate({ _id : id }, { status : "cancelled" });

    return res.status(200).json({ status : "Success" });
}