const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Listing = require('../models/Listing');
const Favorite = require('../models/Favorite');
const LoanApplication = require('../models/LoanApplication');

// Constants
const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Plot', 'Commercial', 'Office'];
const LISTING_TYPES = ['BUY', 'RENT', 'SELL'];
const STATUSES = ['ACTIVE', 'SOLD', 'RENTED'];
const AMENITIES_LIST = [
    'Parking', 'Gym', 'Pool', 'Garden', 'Security', 'Lift',
    'Power Backup', 'Wi-Fi', 'Club House', 'Intercom',
    'Fire Safety', 'Gas Pipeline', 'Park', 'Community Hall'
];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

async function connectDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('MongoDB Connected for Seeding');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
}

async function seed() {
    await connectDB();

    console.log('Cleaning database...');
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Favorite.deleteMany({});
    await LoanApplication.deleteMany({});

    console.log('Creating users...');

    // Create fixed users for testing
    const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // In real app, hash this! Note: The current model stores plain text or uses pre-save hook. Assuming pre-save hook handles hashing if present, or we should hash it. 
        // Checking User model... if it has hashing middleware, plain text is fine. If not, we might need to hash.
        // For now, let's assume the controller/model handles it or just plain for seed.
        // Wait, the authController hashes it. The model probably doesn't. 
        // To be safe and since I can't easily import bcrypt here without checking if it's installed (it is), 
        // I will use a simple hash or just plain text if the auth middleware handles login.
        // Actually, let's import bcrypt since it's in package.json.
        phone: '9876543210',
        role: 'ADMIN'
    });

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Update admin with hashed password
    await User.findByIdAndUpdate(adminUser._id, { password: hashedPassword });

    const agentUser = await User.create({
        name: 'Agent User',
        email: 'agent@example.com',
        password: hashedPassword,
        phone: faker.phone.number('##########'),
        role: 'AGENT'
    });

    const normalUser = await User.create({
        name: 'Test User',
        email: 'user@example.com',
        password: hashedPassword,
        phone: faker.phone.number('##########'),
        role: 'USER'
    });

    // Create random users
    const randomUsers = [];
    for (let i = 0; i < 20; i++) {
        randomUsers.push(await User.create({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: hashedPassword,
            phone: faker.phone.number('##########'),
            role: Math.random() > 0.7 ? 'AGENT' : 'USER'
        }));
    }

    const allUsers = [adminUser, agentUser, normalUser, ...randomUsers];
    const allAgents = allUsers.filter(u => u.role === 'AGENT' || u.role === 'ADMIN');

    console.log('Creating listings...');
    const listings = [];
    for (let i = 0; i < 200; i++) {
        const owner = allAgents[Math.floor(Math.random() * allAgents.length)];
        const city = CITIES[Math.floor(Math.random() * CITIES.length)];
        const type = listingType = LISTING_TYPES[Math.floor(Math.random() * LISTING_TYPES.length)];
        const price = type === 'RENT'
            ? faker.number.int({ min: 5000, max: 200000 })
            : faker.number.int({ min: 2000000, max: 50000000 });

        const numImages = faker.number.int({ min: 1, max: 5 });
        const images = [];
        for (let j = 0; j < numImages; j++) {
            images.push({ url: faker.image.urlLoremFlickr({ category: 'house' }) });
        }

        const listing = await Listing.create({
            title: faker.location.streetAddress() + ' ' + faker.commerce.productAdjective() + ' ' + PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)],
            description: faker.lorem.paragraphs(2),
            price: price,
            currency: 'INR',
            listingType: type,
            bedrooms: faker.number.int({ min: 1, max: 6 }),
            bathrooms: faker.number.int({ min: 1, max: 5 }),
            areaSqFt: faker.number.int({ min: 500, max: 10000 }),
            propertyType: PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)],
            status: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'SOLD' : 'RENTED') : 'ACTIVE',
            address: faker.location.streetAddress(),
            city: city,
            state: 'State', // Simplified for now
            country: 'India',
            zipCode: faker.location.zipCode(),
            amenities: faker.helpers.arrayElements(AMENITIES_LIST, { min: 3, max: 10 }),
            owner: owner._id,
            images: images,
            createdAt: faker.date.past({ years: 1 })
        });
        listings.push(listing);
    }

    console.log('Creating favorites...');
    for (let i = 0; i < 50; i++) {
        const user = allUsers[Math.floor(Math.random() * allUsers.length)];
        const listing = listings[Math.floor(Math.random() * listings.length)];

        // Check duplicate
        const exists = await Favorite.findOne({ user: user._id, listing: listing._id });
        if (!exists) {
            await Favorite.create({ user: user._id, listing: listing._id });
        }
    }

    console.log('Creating loan applications...');
    for (let i = 0; i < 20; i++) {
        const user = allUsers[Math.floor(Math.random() * allUsers.length)];
        const listing = listings[Math.floor(Math.random() * listings.length)];

        await LoanApplication.create({
            user: user._id,
            listing: listing._id,
            loanAmount: listing.price * 0.8,
            tenure: faker.number.int({ min: 5, max: 30 }),
            purpose: 'Home Purchase',
            employment: faker.person.jobTitle(),
            annualIncome: listing.price * 0.2,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: faker.location.streetAddress(),
            status: 'PENDING'
        });
    }

    console.log('Database seeded successfully!');
    console.log(`Created ${allUsers.length} users`);
    console.log(`Created ${listings.length} listings`);
    console.log('Sample User Credentials:');
    console.log('Email: user@example.com');
    console.log('Password: password123');

    process.exit(0);
}

seed();
