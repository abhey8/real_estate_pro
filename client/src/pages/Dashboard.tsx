import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Home, Edit, Trash2, Plus } from 'lucide-react';
import api from '../utils/api';
import { Button } from '../new-src/app/components/ui/button';

export default function Dashboard() {
  const [listings, setListings] = useState<any[]>([]);
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

  const handleDelete = async (id: string) => {
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

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex justify-center">
        <div className="text-2xl font-light text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gray-50">
      <Helmet>
        <title>Dashboard | Real Estate Pro</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-4xl text-black tracking-tight mb-2">My Dashboard</h1>
            <p className="text-gray-500 text-lg">Manage your property listings and account.</p>
          </div>
          <Link to="/listings/create">
            <Button className="w-full md:w-auto bg-black text-white hover:bg-gray-800 h-11 px-6">
              <Plus className="w-5 h-5 mr-2" />
              Create New Listing
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100">
            {error}
          </div>
        )}

        {listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl mb-2 font-medium">No listings yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't posted any properties for sale or rent. Create your first listing to get started.
            </p>
            <Link to="/listings/create">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                Create Your First Listing
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div>
            <h2 className="text-2xl mb-6 font-medium">Your Properties ({listings.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing, index) => (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="relative h-56 bg-gray-100">
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide z-10 shadow-sm">
                      {listing.status || listing.listingType || 'UNKNOWN'}
                    </span>
                    <img
                      src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-e32c53048189?w=800'}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-2xl font-semibold text-black tracking-tight mb-2">
                      {listing.currency === 'USD' ? '$' : listing.currency}
                      {listing.price?.toLocaleString()}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1 leading-snug line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-gray-500 mb-6 flex-1 text-sm flex items-start gap-1">
                      {listing.address}, {listing.city}
                    </p>

                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <Link to={`/listings/${listing._id}/edit`}>
                        <Button variant="outline" className="w-full border-gray-300">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="default"
                        className="w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none"
                        onClick={() => handleDelete(listing._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
