import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/listings');
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await api.delete(`/listings/${id}`);
      loadListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  if (loading) return <div className="loading-state" style={{ padding: '4rem', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div className="dashboard-page" style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <Helmet>
        <title>Dashboard | RealEstate Pro</title>
      </Helmet>

      <div className="container">
        <div className="dashboard-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>My Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your property listings and account.</p>
          </div>
          <Link to="/listings/create" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
            ＋ Create New Listing
          </Link>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem'
          }}>
            {error}
          </div>
        )}

        {listings.length === 0 ? (
          <div className="empty-state" style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-color)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No listings yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You haven't posted any properties for sale or rent.</p>
            <Link to="/listings/create" className="btn btn-primary">
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Your Properties ({listings.length})</h2>
            <div className="listings-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {listings.map((listing) => (
                <div key={listing._id} className="dashboard-card" style={{
                  background: 'var(--surface-color)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      background: 'rgba(255,255,255,0.9)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {listing.status}
                    </span>
                    <img
                      src={listing.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
                      alt={listing.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.25rem' }}>
                      {listing.currency} {listing.price?.toLocaleString()}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      {listing.title}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                      {listing.address}, {listing.city}
                    </p>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                      <Link to={`/listings/${listing._id}/edit`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="btn btn-sm"
                        style={{
                          flex: 1,
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
