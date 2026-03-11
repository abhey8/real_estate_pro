import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Heart } from 'lucide-react';
import { Property } from '../data/properties';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
  index: number;
}

export function PropertyCard({ property, index }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price: number, status: string) => {
    if (status === 'rent') {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={`/properties/${property.id}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <motion.img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                For {property.status}
              </span>
            </div>

            {/* Favorite Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
                }`}
              />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Price */}
            <div className="mb-3">
              <span className="text-2xl tracking-tight">
                {formatPrice(property.price, property.status)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg mb-2 group-hover:opacity-70 transition-opacity">
              {property.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm opacity-60 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>

            {/* Features */}
            <div className="flex items-center gap-4 text-sm border-t pt-4">
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 opacity-60" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 opacity-60" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Square className="w-4 h-4 opacity-60" />
                <span>{property.area.toLocaleString()} sqft</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
