import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Phone, LogOut, Home } from 'lucide-react';
import api from '../utils/api';
import { Button } from '../new-src/app/components/ui/button';

export default function Profile() {
  const { user, logout } = useAuth();
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setLoading(true);
        // Better approach: use the dedicated user listings endpoint
        const response = await api.get('/user/listings');
        setMyListings(response.data.listings || []);
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
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gray-50">
      <Helmet>
        <title>Profile | RealEstate Pro</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-4xl text-black tracking-tight mb-2">My Profile</h1>
            <p className="text-gray-500 text-lg">Manage your personal information</p>
          </div>
          <Button variant="outline" onClick={logout} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">{user.name}</h2>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-6">
                {user.role || 'Member'}
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Properties Listed</h3>
                <p className="text-gray-500 text-sm">Total number of active property listings.</p>
              </div>
              <div className="text-4xl font-bold text-black bg-gray-50 h-16 w-16 rounded-xl flex items-center justify-center">
                {myListings.length}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Properties</h3>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">Manage All</Button>
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading properties...</div>
              ) : myListings.length > 0 ? (
                <div className="space-y-4">
                  {myListings.slice(0, 3).map((listing) => (
                    <div key={listing._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        <img 
                          src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-e32c53048189?w=800'} 
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{listing.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{listing.address}, {listing.city}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-gray-900 text-sm">
                           {listing.currency === 'USD' ? '$' : listing.currency}{listing.price?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 uppercase">{listing.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Home className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-gray-500 mb-4 text-sm">You haven't listed any properties yet.</p>
                  <Link to="/listings/create">
                    <Button size="sm">List a Property</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
