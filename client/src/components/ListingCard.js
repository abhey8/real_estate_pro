import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formatArea, getListingTypeLabel, getPropertyTypeLabel } from '../utils/helpers';

const ListingCard = ({ listing }) => {
    const imageUrl =
        listing.images && listing.images.length > 0
            ? listing.images[0].url
            : null;

    return (
        <Link to={`/listings/${listing.id}`} className="listing-card">
            <div className="listing-image-container">
                {imageUrl ? (
                    <img src={imageUrl} alt={listing.title} className="listing-image" />
                ) : (
                    <div className="no-image">🏠</div>
                )}
                <div className="listing-type-badge">
                    {getListingTypeLabel(listing.listingType)}
                </div>
            </div>
            <div className="listing-content">
                <h3 className="listing-title">{listing.title}</h3>
                <div className="listing-location">
                    📍 {listing.city}, {listing.state}
                </div>
                <div className="listing-details">
                    {listing.bedrooms && (
                        <span className="listing-detail">🛏️ {listing.bedrooms} Bed</span>
                    )}
                    {listing.bathrooms && (
                        <span className="listing-detail">🚿 {listing.bathrooms} Bath</span>
                    )}
                    {listing.areaSqFt && (
                        <span className="listing-detail">
                            📐 {formatArea(listing.areaSqFt)} sq ft
                        </span>
                    )}
                </div>
                <div className="listing-price">{formatPrice(listing.price, listing.currency)}</div>
                <div className="listing-property-type">
                    {getPropertyTypeLabel(listing.propertyType)}
                </div>
            </div>
        </Link>
    );
};

export default ListingCard;
