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
                
                
                
                
                
                
                
                

                
                

                
                const response = await api.get('/listings');
                
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
