const express = require('express');
const router = express.Router();

const auth = require('./router/auth');

router.use('/auth', auth);

module.exports = router;