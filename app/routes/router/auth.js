const express = require('express');
const router = express.Router();

const auth = require('../../controllers/authController');

const { protectedAuth } = require('../../middlewares/auth')

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.post('/edit', protectedAuth, auth.editRole);

module.exports = router;


