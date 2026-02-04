const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PROPERTY_TYPES = ['APARTMENT', 'HOUSE', 'VILLA', 'CONDOMINIUM', 'TOWNHOUSE', 'COMMERCIAL', 'OFFICE', 'RETAIL', 'LAND'];
const LISTING_TYPES = ['BUY', 'SELL', 'RENT'];
const STATES = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Telangana'];
const CITIES = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
    'Karnataka': ['Bangalore', 'Mysore'],
    'Delhi': ['New Delhi'],
    'Tamil Nadu': ['Chennai', 'Coimbatore'],
    'Telangana': ['Hyderabad']
};
const AREAS = ['Downtown', 'Suburbs', 'Financial District', 'Old Town', 'Tech Park', 'Green Valley'];

const TITLES = [
    'Luxury Apartment with City View',
    'Spacious Family Home',
    'Modern Villa with Pool',
    'Cozy Studio near Metro',
    'Premium Office Space',
    'Commercial Shop in Prime Location',
    'Affordable  Housing Plot',
    'Penthouse with Private Terrace',
    'Renovated Heritage Home',
    'Eco-friendly Green Home'
];

const IMAGES = [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-22b5c1221b83?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    console.log('Start seeding ...');

    // Create a test user if not exists
    let user = await prisma.user.findFirst();
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                password: '$2b$10$EpOs.8rU5y.wZ.wZ.wZ.wO', // hash for 'password' (placeholder)
                phone: '1234567890'
            },
        });
        console.log('Created test user:', user.id);
    } else {
        console.log('Using existing user:', user.id);
    }

    const listingsToCreate = 150; // Generate 150 listings

    for (let i = 0; i < listingsToCreate; i++) {
        const state = getRandomElement(STATES);
        const city = getRandomElement(CITIES[state]);
        const listingType = getRandomElement(LISTING_TYPES);
        const propertyType = getRandomElement(PROPERTY_TYPES);
        const area = getRandomElement(AREAS);

        const price = listingType === 'RENT'
            ? getRandomInt(10000, 300000)
            : getRandomInt(2500000, 85000000);

        // Generate more natural sounding titles based on property type
        let titlePrefix = getRandomElement([
            'Spacious', 'Modern', 'Luxury', 'Affordable', 'Cozy', 'Premium',
            'Elegant', 'Exclusive', 'Newly Renovated', 'Prime Location'
        ]);

        let titleSuffix = '';
        if (propertyType === 'OFFICE' || propertyType === 'COMMERCIAL') {
            titleSuffix = getRandomElement(['Workspace', 'Hub', 'Complex', 'Center', 'Unit']);
        } else {
            titleSuffix = getRandomElement(['Home', 'Residence', 'Retreat', 'Haven', 'Abode']);
        }

        const title = `${titlePrefix} ${propertyType.charAt(0) + propertyType.slice(1).toLowerCase()} ${titleSuffix} in ${city}`;

        const imageCount = getRandomInt(1, 4);
        const listingImages = [];
        for (let j = 0; j < imageCount; j++) {
            listingImages.push({ url: getRandomElement(IMAGES) });
        }

        // Better descriptions (Shortened to fit DB limit)
        const features = ['24/7 Security', 'Power Backup', 'Parking', 'Gym', 'Pool'];
        const randomFeatures = features.sort(() => 0.5 - Math.random()).slice(0, 2);
        const description = `Amazing ${propertyType.toLowerCase()} in ${city} (${area}). Amenities: ${randomFeatures.join(', ')}. ${listingType === 'RENT' ? 'Available now.' : 'Great investment.'}`;

        await prisma.listing.create({
            data: {
                title: title,
                description: description,
                price: price,
                currency: 'INR',
                listingType: listingType,
                propertyType: propertyType,
                bedrooms: (propertyType === 'COMMERCIAL' || propertyType === 'OFFICE' || propertyType === 'LAND') ? null : getRandomInt(1, 6),
                bathrooms: (propertyType === 'LAND') ? null : getRandomInt(1, 4),
                areaSqFt: getRandomInt(600, 8000),
                address: `${getRandomInt(1, 100)}, ${area} Main Road`,
                city: city,
                state: state,
                area: area,
                country: 'India',
                status: 'ACTIVE',
                ownerId: user.id,
                images: {
                    create: listingImages
                },
                amenities: randomFeatures
            }
        });
    }

    console.log(`Seeding finished. Added ${listingsToCreate} new listings.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
