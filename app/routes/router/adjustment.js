const express = require('express');
const router = express.Router();

const adjustment = require('../../controllers/adjustmentController');

router.get('/', adjustment.getAllAdjustments);
router.post('/', adjustment.createAdjustment);

module.exports = router;


