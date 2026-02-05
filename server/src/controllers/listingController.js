const prisma = require('../config/db');

const getAllListings = async (req, res) => {
    try {
        const {
            minPrice,
            maxPrice,
            propertyType,
            listingType,
            city,
            state,
            bedrooms,
            status = 'ACTIVE',
            limit = 50,
            skip = 0,
            userId,
            search
        } = req.query;

        const where = {
            status: status
        };

        if (search) {
            where.OR = [
                { title: { contains: search } }, // MySQL is case-insensitive by default with standard collation
                { description: { contains: search } },
                { city: { contains: search } },
                { state: { contains: search } },
                { address: { contains: search } }
            ];
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        if (propertyType) {
            where.propertyType = propertyType;
        }

        if (listingType) {
            where.listingType = listingType;
        }

        if (city && !search) { // Only apply specific city filter if not searching generally
            where.city = { contains: city };
        }

        if (state && !search) { // Only apply specific state filter if not searching generally
            where.state = { contains: state };
        }

        if (bedrooms) {
            where.bedrooms = { gte: parseInt(bedrooms) };
        }

        if (userId) {
            where.ownerId = parseInt(userId);
        }

        const listings = await prisma.listing.findMany({
            where,
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
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: parseInt(limit),
            skip: parseInt(skip)
        });

        const total = await prisma.listing.count({ where });

        res.json({
            listings,
            total,
            limit: parseInt(limit),
            skip: parseInt(skip)
        });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
};

const getListingById = async (req, res) => {
    try {
        const listing = await prisma.listing.findUnique({
            where: { id: parseInt(req.params.id) },
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
        });

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        res.json(listing);
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ error: 'Failed to fetch listing' });
    }
};

const createListing = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            currency = 'INR',
            listingType,
            bedrooms,
            bathrooms,
            areaSqFt,
            propertyType,
            address,
            city,
            state,
            area,
            country = 'India',
            zipCode,
            latitude,
            longitude,
            amenities = [],
            images = []
        } = req.body;

        let processedImages = [];

        // Handle URL images
        if (images) {
            const urlImages = Array.isArray(images) ? images : images.split('\n');
            processedImages = urlImages.map(url => ({ url: typeof url === 'string' ? url.trim() : url.url })).filter(img => img.url);
        }

        // Handle Uploaded Files
        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(file => ({
                url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            }));
            processedImages = [...processedImages, ...uploadedImages];
        }

        const listing = await prisma.listing.create({
            data: {
                title,
                description: description || null,
                price: parseFloat(price), // Convert to number
                currency: currency || 'INR',
                listingType,
                bedrooms: bedrooms ? parseInt(bedrooms) : null,
                bathrooms: bathrooms ? parseInt(bathrooms) : null,
                areaSqFt: areaSqFt ? parseFloat(areaSqFt) : null,
                propertyType,
                address,
                city,
                state,
                area: area || null,
                country,
                zipCode: zipCode || null,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                amenities: Array.isArray(amenities) ? amenities : (typeof amenities === 'string' ? amenities.split(',').map(a => a.trim()).filter(a => a) : []),
                ownerId: req.user.id,
                images: {
                    create: processedImages
                }
            },
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
        });

        res.status(201).json(listing);
    } catch (error) {
        console.error('Error creating listing:', error);

        // Handle Prisma validation errors
        if (error.code === 'P2002') {
            return res.status(400).json({
                error: 'Validation error',
                details: 'A unique constraint violation occurred'
            });
        }

        // Handle Prisma field validation errors
        if (error.meta) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.meta.message || error.message
            });
        }

        // Return more detailed error message
        const errorMessage = error.message || 'Failed to create listing';
        res.status(500).json({
            error: 'Failed to create listing',
            details: errorMessage
        });
    }
};

const updateListing = async (req, res) => {
    try {
        const listingId = parseInt(req.params.id);

        // Check if listing exists and user is owner
        const existingListing = await prisma.listing.findUnique({
            where: { id: listingId }
        });

        if (!existingListing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        if (existingListing.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized to update this listing' });
        }

        const {
            title,
            description,
            price,
            listingType,
            bedrooms,
            bathrooms,
            areaSqFt,
            propertyType,
            status,
            address,
            city,
            state,
            zipCode,
            latitude,
            longitude,
            amenities
        } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (listingType !== undefined) updateData.listingType = listingType;
        if (bedrooms !== undefined) updateData.bedrooms = bedrooms ? parseInt(bedrooms) : null;
        if (bathrooms !== undefined) updateData.bathrooms = bathrooms ? parseInt(bathrooms) : null;
        if (areaSqFt !== undefined) updateData.areaSqFt = areaSqFt ? parseFloat(areaSqFt) : null;
        if (propertyType !== undefined) updateData.propertyType = propertyType;
        if (status !== undefined) updateData.status = status;
        if (address !== undefined) updateData.address = address;
        if (city !== undefined) updateData.city = city;
        if (state !== undefined) updateData.state = state;
        if (zipCode !== undefined) updateData.zipCode = zipCode || null;
        if (latitude !== undefined) updateData.latitude = latitude ? parseFloat(latitude) : null;
        if (longitude !== undefined) updateData.longitude = longitude ? parseFloat(longitude) : null;
        if (amenities !== undefined) updateData.amenities = Array.isArray(amenities) ? amenities : [];

        const listing = await prisma.listing.update({
            where: { id: listingId },
            data: updateData,
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
        });

        res.json(listing);
    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ error: 'Failed to update listing' });
    }
};

const deleteListing = async (req, res) => {
    try {
        const listingId = parseInt(req.params.id);

        const existingListing = await prisma.listing.findUnique({
            where: { id: listingId }
        });

        if (!existingListing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        if (existingListing.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized to delete this listing' });
        }

        await prisma.listing.delete({
            where: { id: listingId }
        });

        res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ error: 'Failed to delete listing' });
    }
};

const getUserListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: { ownerId: req.user.id },
            include: {
                images: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({ listings });
    } catch (error) {
        console.error('Error fetching user listings:', error);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
};

const getRecommendations = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Get user's favorite property types and locations
        const userFavorites = await prisma.favorite.findMany({
            where: { userId: req.user.id },
            include: {
                listing: true
            }
        });

        const favoritePropertyTypes = [...new Set(userFavorites.map(f => f.listing.propertyType))];

        // Get recommendations based on preferences
        const where = {
            status: 'ACTIVE',
            ownerId: { not: req.user.id } // Exclude user's own listings
        };

        if (favoritePropertyTypes.length > 0) {
            where.propertyType = { in: favoritePropertyTypes };
        }

        const recommendations = await prisma.listing.findMany({
            where,
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
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: parseInt(limit)
        });

        res.json({ recommendations });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
};

const compareListings = async (req, res) => {
    try {
        const { listingIds } = req.body;

        if (!Array.isArray(listingIds) || listingIds.length < 2) {
            return res.status(400).json({ error: 'At least 2 listing IDs required' });
        }

        const listings = await prisma.listing.findMany({
            where: {
                id: { in: listingIds.map(id => parseInt(id)) }
            },
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
        });

        res.json({ listings });
    } catch (error) {
        console.error('Error comparing listings:', error);
        res.status(500).json({ error: 'Failed to compare listings' });
    }
};

const getLocations = async (req, res) => {
    try {
        const cities = await prisma.listing.findMany({
            select: { city: true },
            distinct: ['city']
        });

        const states = await prisma.listing.findMany({
            select: { state: true },
            distinct: ['state']
        });

        res.json({
            cities: cities.map(c => c.city).sort(),
            states: states.map(s => s.state).sort()
        });
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
};

module.exports = {
    getAllListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
    getUserListings,
    getRecommendations,
    compareListings,
    getLocations
};
