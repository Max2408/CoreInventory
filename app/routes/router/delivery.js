const express = require('express');
const router = express.Router();

const delivery = require('../../controllers/deliveryController');

router.get('/', delivery.getAlldeliveries);

router.post('/create', delivery.createDelivery);
router.post('/validate/:id', delivery.validateDelivery);

router.delete('/:id', delivery.cancelDelivery);

module.exports = router;


