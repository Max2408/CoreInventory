const express = require('express');
const router = express.Router();

const auth = require('./router/auth');
const product = require('./router/product')

router.use('/auth', auth);
router.use('/product', product);

module.exports = router;