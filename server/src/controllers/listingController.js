const Listing = require('../models/Listing');
const User = require('../models/User');
const Favorite = require('../models/Favorite');

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

        const query = { status };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { state: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (propertyType) {
            query.propertyType = propertyType;
        }

        if (listingType) {
            query.listingType = listingType;
        }

        if (city && !search) {
            query.city = { $regex: city, $options: 'i' };
        }

        if (state && !search) {
            query.state = { $regex: state, $options: 'i' };
        }

        if (bedrooms) {
            query.bedrooms = { $gte: parseInt(bedrooms) };
        }

        if (userId) {
            query.owner = userId;
        }

        const listings = await Listing.find(query)
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Listing.countDocuments(query);

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
        const listing = await Listing.findById(req.params.id)
            .populate('owner', 'name email phone');

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
            processedImages = urlImages.map(url => ({
                url: typeof url === 'string' ? url.trim() : url.url
            })).filter(img => img.url);
        }

        // Handle Uploaded Files
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const uploadedImages = req.files.map(file => ({
                url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            }));
            processedImages = [...processedImages, ...uploadedImages];
        } else if (req.file) {
            // Handle single file case if ever needed
            processedImages.push({
                url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
            });
        }

        const listing = await Listing.create({
            title,
            description: description || null,
            price: parseFloat(price),
            currency: currency || 'INR',
            listingType,
            bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
            bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
            areaSqFt: areaSqFt ? parseFloat(areaSqFt) : undefined,
            propertyType,
            address,
            city,
            state,
            area: area || null,
            country,
            zipCode: zipCode || null,
            latitude: latitude ? parseFloat(latitude) : undefined,
            longitude: longitude ? parseFloat(longitude) : undefined,
            amenities: Array.isArray(amenities) ? amenities : (typeof amenities === 'string' ? amenities.split(',').map(a => a.trim()).filter(a => a) : []),
            owner: req.user._id,
            images: processedImages
        });

        // Populate owner manually or refetch
        await listing.populate('owner', 'name email phone');

        res.status(201).json(listing);
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({
            error: 'Failed to create listing',
            details: error.message
        });
    }
};

const updateListing = async (req, res) => {
    try {
        const listingId = req.params.id;

        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Check ownership (using .toString() for ObjectId comparison)
        if (listing.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
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
        if (bedrooms !== undefined) updateData.bedrooms = bedrooms ? parseInt(bedrooms) : undefined;
        if (bathrooms !== undefined) updateData.bathrooms = bathrooms ? parseInt(bathrooms) : undefined;
        if (areaSqFt !== undefined) updateData.areaSqFt = areaSqFt ? parseFloat(areaSqFt) : undefined;
        if (propertyType !== undefined) updateData.propertyType = propertyType;
        if (status !== undefined) updateData.status = status;
        if (address !== undefined) updateData.address = address;
        if (city !== undefined) updateData.city = city;
        if (state !== undefined) updateData.state = state;
        if (zipCode !== undefined) updateData.zipCode = zipCode || null;
        if (latitude !== undefined) updateData.latitude = latitude ? parseFloat(latitude) : undefined;
        if (longitude !== undefined) updateData.longitude = longitude ? parseFloat(longitude) : undefined;
        if (amenities !== undefined) updateData.amenities = Array.isArray(amenities) ? amenities : [];

        const updatedListing = await Listing.findByIdAndUpdate(
            listingId,
            updateData,
            { new: true, runValidators: true }
        ).populate('owner', 'name email phone');

        res.json(updatedListing);
    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ error: 'Failed to update listing' });
    }
};

const deleteListing = async (req, res) => {
    try {
        const listingId = req.params.id;

        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        if (listing.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized to delete this listing' });
        }

        await Listing.findByIdAndDelete(listingId);

        res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ error: 'Failed to delete listing' });
    }
};

const getUserListings = async (req, res) => {
    try {
        const listings = await Listing.find({ owner: req.user._id })
            .sort({ createdAt: -1 });

        res.json({ listings });
    } catch (error) {
        console.error('Error fetching user listings:', error);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
};

const getRecommendations = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Get user's favorite property types
        const userFavorites = await Favorite.find({ user: req.user._id }).populate('listing');
        const favoritePropertyTypes = [...new Set(userFavorites.map(f => f.listing ? f.listing.propertyType : null).filter(Boolean))];

        const query = {
            status: 'ACTIVE',
            owner: { $ne: req.user._id }
        };

        if (favoritePropertyTypes.length > 0) {
            query.propertyType = { $in: favoritePropertyTypes };
        }

        const recommendations = await Listing.find(query)
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

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

        const listings = await Listing.find({
            _id: { $in: listingIds }
        }).populate('owner', 'name email phone');

        res.json({ listings });
    } catch (error) {
        console.error('Error comparing listings:', error);
        res.status(500).json({ error: 'Failed to compare listings' });
    }
};

const getLocations = async (req, res) => {
    try {
        const cities = await Listing.distinct('city');
        const states = await Listing.distinct('state');

        res.json({
            cities: cities.filter(Boolean).sort(),
            states: states.filter(Boolean).sort()
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
