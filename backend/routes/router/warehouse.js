const express = require('express');
const router = express.Router();

const warehouse = require('../../controllers/warehouseController');

router.get('/', warehouse.getAllWarehouses);
router.get('/:id', warehouse.getWarehouse);

router.post('/', warehouse.createWarehouse);

router.delete('/:id', warehouse.deleteWarehouse);

router.patch('/:id', warehouse.updateWarehouse);

module.exports = router;


