const User = require('../schemas/user');
const Warehouse = require('../schemas/warehouse');

exports.createWarehouse = async (req, res) => {
    const { name, location, managerId } = req.body;
    
    if(!name || !location || !managerId) {
        return res.status(400).json({ status : "Error", error :"Missing Arugments." });
    }

    let manager

    try {
        manager = await User.findOne({ _id : managerId });
    } catch (e) {
        if(process.env.ENVIRONMENT === "dev") {
            console.log(`[-] ${e.message}`);
        }
    }

    if(!manager) {
        return res.status(400).json({ status : "Error", error: "Invaild manager ID." });
    }

    await Warehouse.create({
        name: name,
        location: location,
        managerId: managerId
    });
  
    return res.status(201).json({ status : "Success" });
}

exports.getAllWarehouses = async(req, res) => {
    let pagination = req.query.page

    if(pagination < 0) {
        return res.status(400).json({ status : "Error", error: "Pagination cannot be negative." });
    }

    if(!pagination) pagination = 1;

    const warehouses = await Warehouse.find().skip((pagination-1) * 20);

    return res.status(200).json({ status : "Success", data: warehouses });
}

exports.getWarehouse = async(req, res) => {
    const id = req.params.id

    const warehouse = await Warehouse.findOne({ _id : id });

    if(!warehouse) {
        return res.status(400).json({ status : "Error", error: "Invaild ID." });
    }

    return res.status(200).json({ status : "Success", data: warehouse });
}

exports.updateWarehouse = async(req, res) => {
    const id = req.params.id
    const { name, location, managerId } = req.body;

    const warehouse = await Warehouse.findOne({ _id : id });

    if(!warehouse) {
        return res.status(400).json({ status : "Error", error: "Invaild ID." });
    }

    let manager

    try {
        manager = await User.findOne({ _id : managerId });
    } catch (e) {
        if(process.env.ENVIRONMENT === "dev") {
            console.log(`[-] ${e.message}`);
        }
    }
    
    if(!manager) {
        return res.status(400).json({ status : "Error", error: "Invaild manager ID." });
    }

    await Warehouse.findOneAndUpdate({ _id : id }, {
        name: name?name:warehouse.name,
        location: location?location:warehouse.location,
        managerId: managerId?managerId:warehouse.managerId,
        updatedAt: new Date
    });

    return res.status(200).json({ status : "Success" });
}

exports.deleteWarehouse = async(req, res) => {
    const id = req.params.id

    const warehouse = await Warehouse.findOneAndDelete({ _id : id });

    if(!warehouse) {
        return res.status(400).json({ status : "Error", error: "Invaild ID." });
    }

    return res.status(204).json({ status : "Success" });
}
