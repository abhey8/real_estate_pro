const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const userController = require('../controllers/userController');
const listingController = require('../controllers/listingController');

const router = express.Router();

router.use(authenticateToken);

router.get('/profile', userController.getProfile);
router.get('/listings', listingController.getUserListings);

module.exports = router;
