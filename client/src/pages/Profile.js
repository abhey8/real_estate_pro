import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ListingCard from '../components/ListingCard';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const [myListings, setMyListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyListings = async () => {
            try {
                // Assuming there's an endpoint to get user's listings 
                // OR we can filter listings by ownerId if the user object has an ID
                // For now, let's try a specific endpoint if it exists, otherwise we might need to search
                // Since we don't have a direct "my-listings" endpoint documentation, 
                // I'll try to fetch all and filter or use a search query if supported.
                // Actually, the best way in this codebase seems to be getting listings and filtering client side
                // OR updating the backend.
                // Let's assume we can fetch listings and filter by current user ID for this stub.

                // Wait, listingController has getListings...
                // Let's try to hit /listings?ownerId=${user.id} if supported, or just /listings

                // A better approach for this project structure:
                const response = await api.get('/listings');
                // Filter client side as a fallback if query param not supported naturally yet
                const userListings = response.data.filter(l => l.ownerId === user?.id);
                setMyListings(userListings);
            } catch (error) {
                console.error('Error fetching user listings:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyListings();
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="page-container">
            <div className="container">
                <div className="profile-header">
                    <div className="profile-info">
                        <h1>{user.name}</h1>
                        <p className="profile-email">{user.email}</p>
                        {user.phone && <p className="profile-phone">📞 {user.phone}</p>}
                        <button onClick={logout} className="btn btn-outline-primary btn-sm profile-logout">
                            Logout
                        </button>
                    </div>
                    <div className="profile-stats">
                        <div className="stat-card">
                            <span className="stat-value">{myListings.length}</span>
                            <span className="stat-label">Listings</span>
                        </div>
                    </div>
                </div>

                <div className="profile-listings">
                    <h2>My Properties</h2>
                    {loading ? (
                        <div className="loading">Loading properties...</div>
                    ) : myListings.length > 0 ? (
                        <div className="listings-grid">
                            {myListings.map(listing => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>You haven't listed any properties yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
