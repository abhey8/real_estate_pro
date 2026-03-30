import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Sparkles, MapPin } from 'lucide-react';
import api from '../utils/api';
import { Button } from '../new-src/app/components/ui/button';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/recommendations?limit=20');
        setRecommendations(response.data.recommendations || []);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex justify-center">
        <div className="text-2xl font-light text-gray-500">Loading recommendations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gray-50">
      <Helmet>
        <title>Recommendations | Real Estate Pro</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-4xl text-black tracking-tight mb-2">Recommended Properties</h1>
            <p className="text-gray-500 text-lg">Based on your preferences and favorites</p>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-yellow-500" />
            </div>
            <h3 className="text-2xl mb-2 font-medium">No recommendations yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start browsing properties and adding them to your favorites to get personalized recommendations!
            </p>
            <Link to="/properties">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                Browse Properties
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((listing, index) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col group relative"
              >
                <Link to={`/listings/${listing._id}`} className="block relative h-56 bg-gray-100">
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide z-10 shadow-sm">
                    {listing.listingType || 'FOR SALE'}
                  </span>
                  <img
                    src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-e32c53048189?w=800'}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                </Link>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-2xl font-semibold text-black tracking-tight">
                      {listing.currency === 'USD' ? '$' : listing.currency}
                      {listing.price?.toLocaleString()}
                    </div>
                    <div className="p-1.5 bg-yellow-50 text-yellow-600 rounded-full flex-shrink-0" title="Recommended">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-1 leading-snug line-clamp-1">
                    {listing.title}
                  </h3>
                  <p className="text-gray-500 mb-4 flex items-center gap-1 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{listing.address}, {listing.city} {listing.state}</span>
                  </p>

                  <div className="mt-auto">
                    <Link to={`/listings/${listing._id}`}>
                      <Button variant="outline" className="w-full border-gray-300">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
