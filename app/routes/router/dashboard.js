const express = require('express');
const router = express.Router();

const dashboard = require('../../controllers/dashboardController');

router.get('/kpis', dashboard.kpis);

module.exports = router;


