const Favorite = require('../models/Favorite');
const Listing = require('../models/Listing');

const addFavorite = async (req, res) => {
    try {
        const listingId = req.params.listingId;

        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Check if already favorites
        const existingFavorite = await Favorite.findOne({
            user: req.user._id,
            listing: listingId
        });

        if (existingFavorite) {
            return res.status(400).json({ error: 'Listing already in favorites' });
        }

        // Create favorite
        const favorite = await Favorite.create({
            user: req.user._id,
            listing: listingId
        });

        res.status(201).json({ favorite });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const listingId = req.params.listingId;

        await Favorite.deleteMany({
            user: req.user._id,
            listing: listingId
        });

        res.json({ message: 'Favorite removed' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
};

const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id })
            .populate({
                path: 'listing',
                populate: {
                    path: 'owner',
                    select: 'name email phone'
                }
            })
            .sort({ createdAt: -1 });

        res.json({ favorites });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
};

module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites
};
