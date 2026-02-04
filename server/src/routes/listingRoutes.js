const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const listingController = require('../controllers/listingController');

const router = express.Router();

// Public routes
router.get('/', listingController.getAllListings);
router.get('/locations', listingController.getLocations);
router.post('/compare', listingController.compareListings);
router.get('/:id', listingController.getListingById);

// Protected routes
router.post('/', authenticateToken, [
    body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('listingType').isIn(['BUY', 'SELL', 'RENT']).withMessage('Valid listing type required'),
    body('propertyType').notEmpty().withMessage('Property type required'),
    body('address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
    body('city').trim().notEmpty().withMessage('City required'),
    body('state').trim().notEmpty().withMessage('State required'),
    validate
], listingController.createListing);

router.put('/:id', authenticateToken, listingController.updateListing);
router.delete('/:id', authenticateToken, listingController.deleteListing);

// Special case: Recommendations (Protected)
router.get('/user/recommendations', authenticateToken, listingController.getRecommendations);

module.exports = router;
