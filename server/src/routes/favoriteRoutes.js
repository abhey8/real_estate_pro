const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const favoriteController = require('../controllers/favoriteController');

const router = express.Router();

router.use(authenticateToken);

router.get('/', favoriteController.getFavorites);
router.post('/:listingId', favoriteController.addFavorite);
router.delete('/:listingId', favoriteController.removeFavorite);

module.exports = router;
