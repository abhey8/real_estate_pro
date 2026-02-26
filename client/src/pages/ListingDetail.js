import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  formatPrice,
  formatArea,
  getListingTypeLabel,
  getPropertyTypeLabel,
} from '../utils/helpers';
import './ListingDetail.css';

const ListingDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    loadListing();
    if (isAuthenticated && localStorage.getItem('token')) {
      checkFavorite();
    }
  }, [id, isAuthenticated]);

  const loadListing = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/listings/${id}`);
      setListing(response.data);
    } catch (error) {
      console.error('Error loading listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await api.get('/favorites');
      const favorites = response.data.favorites;
      // Depending on backend, favorites might be objects with listingId or populated listings
      // Assuming simple checking for now
      setIsFavorite(favorites.some((f) => f.listingId === id || f.listing === id || f._id === id));
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) return <div className="loading-state" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  if (!listing) return <div className="error-state" style={{ padding: '4rem', textAlign: 'center' }}>Property not found.</div>;

  return (
    <div className="listing-detail-page">
      <Helmet>
        <title>{listing.title} | RealEstate Pro</title>
      </Helmet>

      {/* Image Gallery */}
      <div className="listing-gallery-header">
        <div className="container">
          <div className="gallery-grid">
            <div className="main-image-container">
              <img
                src={listing.images?.[0]?.url || 'https://via.placeholder.com/800x600'}
                alt={listing.title}
                className="main-image"
              />
            </div>
            <div className="secondary-images">
              {listing.images?.slice(1, 3).map((img, idx) => (
                <div key={idx} className="secondary-image-container">
                  <img src={img.url} alt={`${listing.title} view ${idx + 2}`} />
                </div>
              ))}
              {(!listing.images || listing.images.length < 2) && (
                <div className="secondary-image-container" style={{ background: '#e2e8f0' }}></div>
              )}
              {(!listing.images || listing.images.length < 3) && (
                <div className="secondary-image-container" style={{ background: '#cbd5e1' }}></div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container listing-content-layout">
        <div className="listing-main-info">

          <div className="listing-header-block">
            <div className="header-top">
              <span className="listing-type-tag">{getListingTypeLabel(listing.listingType)}</span>
              <span className="property-type-tag">{getPropertyTypeLabel(listing.propertyType)}</span>
            </div>

            <h1 className="listing-title-large">{listing.title}</h1>

            <div className="listing-location-large">
              📍 {listing.address}, {listing.city}, {listing.state} {listing.zipCode}
            </div>

            <div className="listing-price-large">
              {formatPrice(listing.price, listing.currency)}
              {listing.listingType === 'RENT' && <span className="period" style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mo</span>}
            </div>

            <div className="listing-stats-bar">
              {listing.bedrooms > 0 && (
                <div className="stat-item">
                  <span className="stat-value">{listing.bedrooms}</span>
                  <span className="stat-label">Beds</span>
                </div>
              )}
              {listing.bedrooms > 0 && <div className="stat-divider"></div>}

              {listing.bathrooms > 0 && (
                <div className="stat-item">
                  <span className="stat-value">{listing.bathrooms}</span>
                  <span className="stat-label">Baths</span>
                </div>
              )}
              {listing.bathrooms > 0 && <div className="stat-divider"></div>}

              {listing.areaSqFt > 0 && (
                <div className="stat-item">
                  <span className="stat-value">{formatArea(listing.areaSqFt)}</span>
                  <span className="stat-label">Sq Ft</span>
                </div>
              )}
            </div>
          </div>

          {listing.description && (
            <div className="content-block">
              <h3>Description</h3>
              <p className="listing-description">
                {listing.description}
              </p>
            </div>
          )}

          {listing.amenities && listing.amenities.length > 0 && (
            <div className="content-block">
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {listing.amenities.map((amenity, idx) => (
                  <div key={idx} className="amenity-item">
                    ✅ {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="listing-sidebar">
          <div className="contact-card">
            <h3>Interested in this property?</h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Contact the seller to schedule a viewing or ask questions.</p>

            {!showContact ? (
              <button onClick={() => setShowContact(true)} className="btn btn-primary btn-full-width">
                Contact Seller
              </button>
            ) : (
              <div className="contact-info-card" style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ marginBottom: '0.5rem' }}><strong>Name:</strong> {listing.owner?.name || 'Seller'}</div>
                <div style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> {listing.owner?.email || 'N/A'}</div>
              </div>
            )}

            <button
              className={`btn btn-secondary btn-full-width ${isFavorite ? 'active' : ''}`}
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              style={{ marginTop: '0.75rem' }}
            >
              {isFavorite ? '❤️ Saved' : '🤍 Save to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
