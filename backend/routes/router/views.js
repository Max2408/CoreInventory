const express = require('express');
const router = express.Router();

const views = require('../../controllers/viewsController');

router.get('/login', views.login);
router.get('/register', views.register);

module.exports = router;


