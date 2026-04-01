import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Heart, HeartOff, MapPin } from 'lucide-react';

import api from '../utils/api';
import { normalizeFavoriteListings } from '../utils/favorites';
import { Button } from '../new-src/app/components/ui/button';

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const FALLBACK_PROPERTY_IMAGE = '/property-placeholder.svg';

const formatPrice = (listing: any) => {
  const price = Number(listing?.price || 0);
  const listingType = String(listing?.listingType || '').toUpperCase();

  if (listingType === 'RENT') {
    return `${INR_FORMATTER.format(price)}/month`;
  }

  return INR_FORMATTER.format(price);
};

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/favorites');
      setFavorites(normalizeFavoriteListings(response.data.favorites || []));
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (event: React.MouseEvent, listingId: string) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await api.delete(`/favorites/${listingId}`);
      setFavorites((current) => current.filter((listing) => String(listing._id || listing.id) !== String(listingId)));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center px-4 pt-24">
        <div className="text-2xl font-light text-gray-500">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-20 pb-16">
      <Helmet>
        <title>My Favorites | Real Estate Pro</title>
      </Helmet>

      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-4xl tracking-tight text-black">My Favorites</h1>
            <p className="text-lg text-gray-500">Properties you've saved</p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-2xl font-medium">No favorites yet</h3>
            <p className="mx-auto mb-8 max-w-md text-gray-500">
              Start browsing properties and add them to your favorites to see them here.
            </p>
            <Link to="/properties">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                Browse Properties
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((listing, index) => {
              const listingId = String(listing._id || listing.id);
              const imageUrl = listing.images?.[0]?.url || listing.images?.[0] || FALLBACK_PROPERTY_IMAGE;
              const location = [listing.address || listing.area, listing.city, listing.state].filter(Boolean).join(', ');

              return (
                <motion.div
                  key={listingId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  <Link to={`/listings/${listingId}`} className="relative block h-56 bg-gray-100">
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur-sm">
                      {listing.listingType || 'FOR SALE'}
                    </span>
                    <img
                      src={imageUrl}
                      alt={listing.title || 'Favorite property'}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = FALLBACK_PROPERTY_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="text-2xl font-semibold tracking-tight text-black">{formatPrice(listing)}</div>
                      <button
                        onClick={(event) => handleRemoveFavorite(event, listingId)}
                        className="tooltip flex-shrink-0 rounded-full bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100 hover:text-red-600"
                        title="Remove from favorites"
                      >
                        <HeartOff className="h-5 w-5" />
                      </button>
                    </div>

                    <h3 className="mb-1 line-clamp-1 text-lg font-medium leading-snug text-gray-900">
                      {listing.title || 'Saved property'}
                    </h3>
                    <p className="mb-4 flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{location || 'Location unavailable'}</span>
                    </p>

                    <div className="mt-auto">
                      <Link to={`/listings/${listingId}`}>
                        <Button variant="outline" className="w-full border-gray-300">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
