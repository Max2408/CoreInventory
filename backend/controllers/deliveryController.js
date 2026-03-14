const Warehouse = require("../schemas/warehouse");
const Product = require("../schemas/product");
const Delivery = require("../schemas/delivery");
const Stock = require("../schemas/stock");
const StockMove = require("../schemas/stockMove");

exports.createDelivery = async (req, res) => {
    let { customer, warehouseId, products } = req.body;

    if(!warehouseId || !products || !customer) {
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

     await Delivery.create({
        customer: customer,
        warehouseId: warehouseId,
        status: "draft",
        products: productSchema
    });
      
    return res.status(201).json({ status : "Success" });
}

exports.getAlldeliveries = async (req, res) => {
    let pagination = req.query.page;
        
    if(pagination < 0) {
        return res.status(400).json({ status : "Error", error: "Pagination cannot be negative." });
    }

    if(!pagination) pagination = 1;

    const deliveries = await Delivery.find().skip((pagination-1) * 20);

    return res.status(200).json({ status : "Success", data: deliveries });
}

exports.validateDelivery = async (req, res) => {
     let id = req.params.id;
    
    const delivery = await Delivery.findOne({ _id : id });

    if(!delivery) {
        return res.status(404).json({ status : "Error", error: "Invaild Delivery ID." });
    }

    if (delivery.status === "done" || delivery.status === "cancelled") {
        return res.status(400).json({ message: "Delivery already validated" });
    }

     for(let i = 0; i < delivery.products.length; i++) {
        let product

        try {
            product = await Product.findOne({ _id : delivery.products[i].productId });
        } catch(e) {
            if(process.env.ENVIRONMENT === "dev") {
                console.log(`[-] ${e.message}`);
            }
        }

        if(!product) {
            return res.status(400).json({ message: `Product with id: ${delivery.products[i].productId} Not Found.` });
        }

        let stock = await Stock.findOne({ productId: delivery.products[i].productId, warehouseId: delivery.warehouseId });

        if(!stock || stock.quantity < delivery.products[i].quantity) {
            return res.status(400).json({ message: `Insufficient stock for product with id: ${delivery.products[i].productId}` });
        }

        await Stock.findOneAndUpdate({ productId: delivery.products[i].productId, warehouseId: delivery.warehouseId }, {
            quantity: stock.quantity - delivery.products[i].quantity
        });

        await StockMove.create({
            type: "delivery",
            productId: delivery.products[i].productId,
            warehouseId: delivery.warehouseId,
            quantityChange: `-${delivery.products[i].quantity}`,
            referenceId: delivery._id
        });
    }

    await Delivery.findOneAndUpdate({ _id : id }, { status: "done" });
    return res.status(200).json({ status : "Success" });
}

exports.cancelDelivery = async (req, res) => {
    const id = req.params.id;
    
    const delivery = await Delivery.findOne({  _id : id });

    if(!delivery) {
        return res.status(404).json({ status: "error", error: "Invaild Delivery ID."});
    }

    if(delivery.status === "done" || delivery.status === "cancelled") {
        return res.status(404).json({ status: "error", error: "Can't delete this delivery, it has been marked done."});
    }

    await Delivery.findOneAndUpdate({ _id : id }, { status : "cancelled" });

    return res.status(200).json({ status : "Success" });
}