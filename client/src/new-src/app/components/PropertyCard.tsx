import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Bath, Bed, Heart, MapPin, Square } from 'lucide-react';
import { Property } from '../data/properties';
import api from '../../../utils/api';
import { getFavoriteListingId } from '../../../utils/favorites';
import { useAuth } from '../../../context/AuthContext';

interface PropertyCardProps {
  property: Property;
  index: number;
}

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const FALLBACK_PROPERTY_IMAGE = '/property-placeholder.svg';
let favoriteIdsCache: Set<string> | null = null;
let favoriteIdsRequest: Promise<Set<string>> | null = null;

const getFavoriteIds = async () => {
  if (favoriteIdsCache) {
    return favoriteIdsCache;
  }

  if (!favoriteIdsRequest) {
    favoriteIdsRequest = api
      .get('/favorites')
      .then((response) => {
        const favorites = response.data.favorites || [];
        const nextCache = new Set<string>();

        favorites.forEach((favorite: any) => {
          const favoriteListingId = getFavoriteListingId(favorite);
          if (favoriteListingId) {
            nextCache.add(favoriteListingId);
          }
        });

        favoriteIdsCache = nextCache;
        return nextCache;
      })
      .catch((error) => {
        favoriteIdsRequest = null;
        throw error;
      });
  }

  return favoriteIdsRequest;
};

const syncFavoriteCache = (propertyId: string, shouldBeFavorite: boolean) => {
  const nextCache = new Set(favoriteIdsCache || []);

  if (shouldBeFavorite) {
    nextCache.add(propertyId);
  } else {
    nextCache.delete(propertyId);
  }

  favoriteIdsCache = nextCache;
  favoriteIdsRequest = Promise.resolve(nextCache);
};

const formatPrice = (price: number, status: string) => {
  if (status === 'rent') {
    return `${INR_FORMATTER.format(price)}/month`;
  }

  return INR_FORMATTER.format(price);
};

const formatListingStatus = (status: string) => {
  if (status === 'rent') {
    return 'For Rent';
  }

  if (status === 'buy') {
    return 'For Buy';
  }

  return 'For Sell';
};

export function PropertyCard({ property, index }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated || !localStorage.getItem('token')) {
      setIsFavorite(false);
      return () => {
        isMounted = false;
      };
    }

    const loadFavoriteState = async () => {
      try {
        const favoriteIds = await getFavoriteIds();
        if (isMounted) {
          setIsFavorite(favoriteIds.has(String(property.id)));
        }
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };

    loadFavoriteState();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, property.id]);

  const handleFavoriteToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const propertyId = String(property.id);
    setFavoriteLoading(true);

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${propertyId}`);
        setIsFavorite(false);
        syncFavoriteCache(propertyId, false);
      } else {
        await api.post(`/favorites/${propertyId}`);
        setIsFavorite(true);
        syncFavoriteCache(propertyId, true);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <Link to={`/listings/${property.id}`} className="block h-full">
        <div className="flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition-shadow duration-300 hover:shadow-[0_26px_60px_rgba(15,23,42,0.12)]">
          <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
            <div className="absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-slate-900/25 via-slate-900/5 to-transparent" />
            <motion.img
              src={property.image}
              alt={property.title}
              loading="lazy"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.35 }}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = FALLBACK_PROPERTY_IMAGE;
              }}
            />

            <div className="absolute left-4 top-4 z-10">
              <span className="rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-700 backdrop-blur-sm">
                {formatListingStatus(property.status)}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              disabled={favoriteLoading}
              onClick={handleFavoriteToggle}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/95 text-slate-700 shadow-sm backdrop-blur-sm disabled:opacity-50"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'
                }`}
              />
            </motion.button>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="mb-3">
              <span className="text-2xl font-semibold tracking-tight text-slate-900">
                {formatPrice(property.price, property.status)}
              </span>
            </div>

            <h3 className="min-h-[3.5rem] text-lg font-medium leading-7 text-slate-900 transition-colors duration-300 group-hover:text-slate-700">
              {property.title}
            </h3>

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-slate-400" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-slate-400" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Square className="h-4 w-4 text-slate-400" />
                <span>{Math.round(property.area || 0).toLocaleString()} sqft</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
