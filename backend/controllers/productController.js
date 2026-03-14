const config = require('../config.json')
const Product = require("../schemas/product");

exports.createProduct = async (req, res) => {
    const { name, sku, category, perHandCost } = req.body;
    
    if(!name || !sku || !category || !perHandCost) {
        return res.status(400).json({ status : "Error", error :"Missing Arugments." });
    }

    const existingSKU = await Product.findOne({ sku });

    if (existingSKU) {
        return res.status(400).json({ status : "Error", error: "SKU already exists." });
    }

    await Product.create({
        name: name,
        sku: sku,
        category: category,
        reorderLevel: config.RE_ORDER_LEVEL,
        perHandCost: perHandCost,
        stock: stock
    });
  
    return res.status(201).json({ status : "Success" });
}

exports.getAllProducts = async(req, res) => {
    let pagination = req.query.page

    if(pagination < 0) {
        return res.status(400).json({ status : "Error", error: "Pagination cannot be negative." });
    }

    if(!pagination) pagination = 1;

    const products = await Product.find().skip((pagination-1) * 20);

    return res.status(200).json({ status : "Success", data: products });
}

exports.getProduct = async(req, res) => {
    const id = req.params.id

    const product = await Product.findOne({ _id : id });

    if(!product) {
        return res.status(400).json({ status : "Error", error: "Invaild ID." });
    }

    return res.status(200).json({ status : "Success", data: product });
}

exports.updateProduct = async(req, res) => {
    const id = req.params.id
    const { name, sku, category, perHandCost } = req.body;

    const product = await Product.findOne({ _id : id });

    if(!product) {
        return res.status(400).json({ status : "Error", error: "Invaild ID." });
    }

    await Product.findOneAndUpdate({ _id : id }, {
        name: name?name:product.name,
        sku: sku?sku:product.sku,
        category: category?category:product.category,
        perHandCost: perHandCost?perHandCost:product.perHandCost,
        updatedAt: new Date
    });

    return res.status(200).json({ status : "Success" });
}

exports.deleteProduct = async(req, res) => {
    const id = req.params.id

    const product = await Product.findOneAndDelete({ _id : id });

    if(!product) {
        return res.status(400).json({ status : "Error", error: "Invaild ID." });
    }

    return res.status(204).json({ status : "Success" });
}

