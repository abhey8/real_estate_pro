import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Map, LayoutGrid } from 'lucide-react';
import { PropertyCard } from '../new-src/app/components/PropertyCard';
import { PropertyFilters, FilterState } from '../new-src/app/components/PropertyFilters';
import { MapView } from '../new-src/app/components/MapView';
import { Button } from '../new-src/app/components/ui/button';
import api from '../utils/api';
import './Home.css';

export default function Properties() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    type: 'all',
    priceRange: [0, 5000000],
    bedrooms: 'any',
  });

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.status !== 'all') {
        // Assuming status matches "buy" or "rent", API probably wants listingType "BUY" or "RENT"
        queryParams.append('listingType', filters.status.toUpperCase());
      }
      
      if (filters.type !== 'all') {
        queryParams.append('propertyType', filters.type.toUpperCase());
      }

      if (filters.priceRange[0] > 0) {
        queryParams.append('minPrice', filters.priceRange[0].toString());
      }

      if (filters.priceRange[1] < 5000000) {
        queryParams.append('maxPrice', filters.priceRange[1].toString());
      }

      if (filters.bedrooms !== 'any') {
        queryParams.append('bedrooms', filters.bedrooms);
      }

      queryParams.append('status', 'ACTIVE');
      queryParams.append('limit', '100');

      const response = await api.get(`/listings?${queryParams}`);
      
      const adaptedListings = (response.data.listings || []).map((listing: any) => ({
        id: listing._id || listing.id,
        title: listing.title,
        location: `${listing.address}, ${listing.city}`,
        price: listing.price,
        status: listing.listingType?.toLowerCase() || 'buy',
        image: listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-e32c53048189?w=800',
        bedrooms: listing.bedrooms || 0,
        bathrooms: listing.bathrooms || 0,
        area: listing.area || listing.squareFootage || 0,
        coordinates: [listing.latitude || 37.7749, listing.longitude || -122.4194]
      }));

      setListings(adaptedListings);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <section className="bg-black text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl mb-4 tracking-tight">Our Properties</h1>
            <p className="text-xl opacity-80 max-w-2xl">
              Browse through our exclusive collection of luxury properties
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <PropertyFilters filters={filters} onFilterChange={setFilters} />
        </div>
      </section>

      {/* View Toggle and Results */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <p className="text-lg">
                <span className="opacity-60">Found </span>
                <span className="font-semibold">{loading ? '...' : listings.length}</span>
                <span className="opacity-60"> {listings.length === 1 ? 'property' : 'properties'}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? '' : 'bg-transparent hover:bg-white'}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? '' : 'bg-transparent hover:bg-white'}
              >
                <Map className="w-4 h-4 mr-2" />
                Map
              </Button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {loading ? (
                <div className="col-span-full text-center py-20 text-xl font-light">Loading properties...</div>
              ) : listings.length > 0 ? (
                listings.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-xl opacity-60">No properties match your filters</p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() =>
                      setFilters({
                        status: 'all',
                        type: 'all',
                        priceRange: [0, 5000000],
                        bedrooms: 'any',
                      })
                    }
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[600px] md:h-[700px] rounded-2xl overflow-hidden shadow-lg"
            >
              <MapView properties={listings} />
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
