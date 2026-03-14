const express = require('express');
const router = express.Router();

const receipts = require('../../controllers/receiptController');

router.get('/', receipts.getAllreceipts);

router.post('/create', receipts.createOrder);
router.post('/validate/:id', receipts.validateOrder);

router.patch('/:id', receipts.updateOrder);

router.delete('/:id', receipts.deleteReceipt)

module.exports = router;


