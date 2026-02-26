import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
    // Use first image or fallback
    const imageUrl = listing.images && listing.images.length > 0
        ? listing.images[0].url
        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: listing.currency || 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <Link to={`/listings/${listing._id || listing.id}`} className="listing-card">
            <div className="listing-image-container">
                <span className="listing-type-badge">
                    {listing.listingType}
                </span>
                <img
                    src={imageUrl}
                    alt={listing.title}
                    className="listing-image"
                    loading="lazy"
                />
                <div className="listing-property-type" style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    top: 'auto',
                    background: 'rgba(255,255,255,0.95)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    {listing.propertyType}
                </div>
            </div>

            <div className="listing-content">
                <div className="listing-price">
                    {formatPrice(listing.price)}
                    {listing.listingType === 'RENT' && <span style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-tertiary)',
                        fontWeight: 400,
                        marginLeft: '4px'
                    }}>/mo</span>}
                </div>

                <h3 className="listing-title">{listing.title}</h3>

                <div className="listing-location">
                    <span>📍</span> {listing.city}, {listing.state}
                </div>

                <div className="listing-details">
                    {listing.bedrooms > 0 && <span>🛏 {listing.bedrooms} Beds</span>}
                    {listing.bathrooms > 0 && <span>🚿 {listing.bathrooms} Baths</span>}
                    {listing.areaSqFt > 0 && <span>📐 {listing.areaSqFt} sqft</span>}
                </div>
            </div>
        </Link>
    );
};

export default ListingCard;
