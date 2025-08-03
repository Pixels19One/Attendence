const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', AuthController.validate.register, AuthController.register);
router.post('/login', AuthController.validate.login, AuthController.login);

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile', 
  authenticateToken, 
  AuthController.validate.register, 
  AuthController.updateProfile
);

module.exports = router;