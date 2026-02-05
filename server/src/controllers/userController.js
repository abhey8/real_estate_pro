const prisma = require('../config/db');

const getUserListings = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware

        const listings = await prisma.listing.findMany({
            where: { ownerId: userId },
            include: {
                images: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ listings });
    } catch (error) {
        console.error('Error fetching user listings:', error);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
};

module.exports = {
    getUserListings
};
