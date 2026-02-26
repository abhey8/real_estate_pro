require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/loans', loanRoutes);

// Config for serving the React build
const clientBuildPath = path.join(__dirname, '../../client/build');
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(clientBuildPath));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback for React routing (serve index.html for non-API routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
