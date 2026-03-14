const express = require('express');
const router = express.Router();

const auth = require('./router/auth');
const product = require('./router/product');
const warehouse = require('./router/warehouse');
const receipts = require('./router/receipts');
const delivery = require('./router/delivery');
const transfer = require('./router/transfer');
const adjustment = require('./router/adjustment');
const dashboard = require('./router/dashboard');

router.use('/auth', auth);
router.use('/product', product);
router.use('/warehouse', warehouse);
router.use('/receipts', receipts);
router.use('/delivery', delivery);
router.use('/adjustment', adjustment);
router.use('/transfer', transfer);
router.use('/dashboard', dashboard);

module.exports = router;