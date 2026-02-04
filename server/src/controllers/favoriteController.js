const prisma = require('../config/db');

const addFavorite = async (req, res) => {
    try {
        const listingId = parseInt(req.params.listingId);

        // Check if listing exists
        const listing = await prisma.listing.findUnique({
            where: { id: listingId }
        });

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Create or find favorite
        const favorite = await prisma.favorite.upsert({
            where: {
                userId_listingId: {
                    userId: req.user.id,
                    listingId: listingId
                }
            },
            update: {},
            create: {
                userId: req.user.id,
                listingId: listingId
            }
        });

        res.status(201).json({ favorite });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const listingId = parseInt(req.params.listingId);

        await prisma.favorite.deleteMany({
            where: {
                userId: req.user.id,
                listingId: listingId
            }
        });

        res.json({ message: 'Favorite removed' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
};

const getFavorites = async (req, res) => {
    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: req.user.id },
            include: {
                listing: {
                    include: {
                        images: true,
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

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
