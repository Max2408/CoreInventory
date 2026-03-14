const express = require('express');
const router = express.Router();

const auth = require('./router/auth');
const product = require('./router/product');
const warehouse = require('./router/warehouse');
const receipts = require('./router/receipts');
const delivery = require('./router/delivery');

router.use('/auth', auth);
router.use('/product', product);
router.use('/warehouse', warehouse);
router.use('/receipts', receipts);
router.use('/delivery', delivery);

module.exports = router;