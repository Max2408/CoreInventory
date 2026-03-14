const express = require('express');
const router = express.Router();

const transfer = require('../../controllers/transferController');

router.get('/', transfer.getTransfers);

router.post('/', transfer.initiateTransfer);
router.post('/validate/:id', transfer.validateTransfer);

router.delete('/:id', transfer.cancelTransfer);

module.exports = router;


