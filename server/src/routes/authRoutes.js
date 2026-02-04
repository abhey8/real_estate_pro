const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim(),
    validate
], authController.register);

router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate
], authController.login);

router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
