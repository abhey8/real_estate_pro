const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    listingType: {
        type: String,
        required: true
    },
    bedrooms: {
        type: Number
    },
    bathrooms: {
        type: Number
    },
    areaSqFt: {
        type: Number
    },
    propertyType: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    area: String,
    country: {
        type: String,
        required: true
    },
    zipCode: String,
    latitude: Number,
    longitude: Number,
    status: {
        type: String,
        default: 'ACTIVE'
    },
    amenities: [String], // Array of strings for amenities
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [{
        url: String,
        caption: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
