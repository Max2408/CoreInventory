const express = require('express');
const router = express.Router();

const auth = require('./router/auth');
const product = require('./router/product');
const warehouse = require('./router/warehouse');

router.use('/auth', auth);
router.use('/product', product);
router.use('/warehouse', warehouse);

module.exports = router;