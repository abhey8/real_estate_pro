const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/api';

async function testCreateListing() {
    try {
        // 1. Login to get token
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'test@example.com',
            password: 'password'
        });
        const token = loginRes.data.token;
        console.log('Login successful, token received');

        // 2. Create Listing with FormData
        const form = new FormData();
        form.append('title', 'Test Listing with Image');
        form.append('description', 'This is a test listing created via script');
        form.append('price', '5000000');
        form.append('listingType', 'SELL');
        form.append('propertyType', 'APARTMENT');
        form.append('address', '123 Test Street');
        form.append('city', 'Test City');
        form.append('state', 'Test State');
        form.append('bedrooms', '2');
        form.append('bathrooms', '2');
        form.append('areaSqFt', '1200');

        // Append a dummy file (create one if not exists)
        const dummyFilePath = path.join(__dirname, 'test_image.jpg');
        if (!fs.existsSync(dummyFilePath)) {
            fs.writeFileSync(dummyFilePath, 'dummy image content');
        }
        form.append('imageFiles', fs.createReadStream(dummyFilePath));

        const headers = {
            ...form.getHeaders(),
            'Authorization': `Bearer ${token}`
        };

        const response = await axios.post(`${API_URL}/listings`, form, { headers });
        console.log('Create Listing Response:', response.status, response.data);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testCreateListing();
