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
const views = require('./router/views')

const { protectedAuth } = require('../middlewares/auth')

router.use('/', views)

router.use('/auth', auth);

router.use('/product', protectedAuth, product);
router.use('/warehouse', protectedAuth, warehouse);
router.use('/receipts', protectedAuth, receipts);
router.use('/delivery', protectedAuth, delivery);
router.use('/adjustment', protectedAuth, adjustment);
router.use('/transfer', protectedAuth, transfer);
router.use('/dashboard', protectedAuth, dashboard);

module.exports = router;