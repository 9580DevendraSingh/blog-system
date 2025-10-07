const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { validateUserRegistration } = require('../middleware/validation');

const router = express.Router();

// ✅ SAHI ROUTE PATHS
router.post('/register', validateUserRegistration, register);
router.post('/login', login);
router.get('/me', auth, getMe);

module.exports = router;