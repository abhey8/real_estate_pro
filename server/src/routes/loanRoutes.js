const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const loanController = require('../controllers/loanController');

const router = express.Router();

router.use(authenticateToken);

router.get('/', loanController.getLoans);

router.post('/apply', [
    body('loanAmount').isFloat({ min: 0 }).withMessage('Loan amount must be positive'),
    body('tenure').isInt({ min: 1 }).withMessage('Tenure must be at least 1 month'),
    body('purpose').trim().notEmpty().withMessage('Purpose required'),
    body('employment').trim().notEmpty().withMessage('Employment type required'),
    body('annualIncome').isFloat({ min: 0 }).withMessage('Annual income must be positive'),
    body('name').trim().notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').trim().notEmpty().withMessage('Phone required'),
    body('address').trim().notEmpty().withMessage('Address required'),
    validate
], loanController.applyForLoan);

module.exports = router;
