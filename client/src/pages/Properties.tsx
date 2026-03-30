import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Map, LayoutGrid } from 'lucide-react';
import { PropertyCard } from '../new-src/app/components/PropertyCard';
import { PropertyFilters, FilterState } from '../new-src/app/components/PropertyFilters';
import { MapView } from '../new-src/app/components/MapView';
import { Button } from '../new-src/app/components/ui/button';
import { getAllStates, getCitiesByState } from '../utils/locations';
import api from '../utils/api';
import './Home.css';

const CHANDIGARH_LOCALITIES = [
  { name: 'Zirakpur', rating: 4.3 },
  { name: 'Mullanpur', rating: 3.9 },
  { name: 'Dera Bassi', rating: 3.8 },
  { name: 'New Chandigarh', rating: 4.4 },
  { name: 'Kharar', rating: 4.0 },
];

const unique = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));

const normalize = (value: string) => value.trim().toLowerCase();

export default function Properties() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationOptions, setLocationOptions] = useState<{ states: string[]; cities: string[] }>({
    states: [],
    cities: [],
  });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    listingType: 'all',
    state: '',
    city: '',
    propertyTypes: [],
    bedrooms: 'any',
    constructionStatus: 'all',
    postedBy: 'all',
    minPrice: 0,
    maxPrice: 50000000,
    minArea: '',
    maxArea: '',
    localities: [],
  });

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const stateOptions = useMemo(() => unique([...getAllStates(), ...locationOptions.states]), [locationOptions.states]);

  const cityOptions = useMemo(() => {
    if (!filters.state) return [];
    return unique(getCitiesByState(filters.state));
  }, [filters.state]);

  const localityOptions = useMemo(() => {
    const cityText = `${filters.city} ${filters.search}`.toLowerCase();
    if (!cityText) return [];
    if (
      cityText.includes('chandigarh') ||
      cityText.includes('zirakpur') ||
      cityText.includes('mullanpur') ||
      cityText.includes('dera bassi') ||
      cityText.includes('kharar')
    ) {
      return CHANDIGARH_LOCALITIES;
    }
    return [];
  }, [filters.city, filters.search]);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await api.get('/listings/locations');
        setLocationOptions({
          states: response.data?.states || [],
          cities: response.data?.cities || [],
        });
      } catch (error) {
        console.error('Error loading location options:', error);
      }
    };

    loadLocations();
  }, []);

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.search.trim()) {
        queryParams.append('search', filters.search.trim());
      }

      if (filters.listingType !== 'all') {
        queryParams.append('listingType', filters.listingType);
      }

      if (filters.propertyTypes.length > 0) {
        queryParams.append('propertyType', filters.propertyTypes.join(','));
      }

      const canServerFilterByState =
        !!filters.state &&
        locationOptions.states.some((state) => normalize(state) === normalize(filters.state));

      if (canServerFilterByState) {
        queryParams.append('state', filters.state);
      }

      if (filters.city) {
        queryParams.append('city', filters.city);
      }

      if (filters.localities.length > 0) {
        queryParams.append('locality', filters.localities.join(','));
      }

      if (filters.bedrooms !== 'any') {
        queryParams.append('bedrooms', parseInt(filters.bedrooms, 10).toString());
      }

      if (filters.minPrice > 0) {
        queryParams.append('minPrice', filters.minPrice.toString());
      }

      if (filters.maxPrice < 50000000) {
        queryParams.append('maxPrice', filters.maxPrice.toString());
      }

      if (filters.minArea) {
        queryParams.append('minArea', filters.minArea);
      }

      if (filters.maxArea) {
        queryParams.append('maxArea', filters.maxArea);
      }

      if (filters.constructionStatus !== 'all') {
        queryParams.append('constructionStatus', filters.constructionStatus);
      }

      if (filters.postedBy !== 'all') {
        queryParams.append('postedBy', filters.postedBy);
      }

      queryParams.append('status', 'ACTIVE');
      queryParams.append('limit', '100');

      const response = await api.get(`/listings?${queryParams.toString()}`);
      let apiListings = response.data.listings || [];

      if (filters.state && !canServerFilterByState) {
        const allowedCities = new Set(getCitiesByState(filters.state).map((city) => normalize(city)));
        if (allowedCities.size > 0) {
          apiListings = apiListings.filter((listing: any) => allowedCities.has(normalize(listing.city || '')));
        }
      }

      const adaptedListings = apiListings.map((listing: any) => ({
        id: listing._id || listing.id,
        title: listing.title,
        location: [listing.area, listing.city, listing.state].filter(Boolean).join(', '),
        price: listing.price,
        status: listing.listingType?.toLowerCase() || 'buy',
        image: listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-e32c53048189?w=800',
        bedrooms: listing.bedrooms || 0,
        bathrooms: listing.bathrooms || 0,
        area: listing.areaSqFt || 0,
        coordinates: [listing.latitude || 28.6139, listing.longitude || 77.2090],
      }));

      setListings(adaptedListings);
    } catch (error) {
      console.error('Error loading listings:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="bg-black text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl mb-4 tracking-tight">Search Properties</h1>
            <p className="text-xl opacity-80 max-w-3xl">
              Explore verified homes in India with smart filters for city, locality, property type, and budget.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
          <div className="lg:sticky lg:top-24">
            <PropertyFilters
              filters={filters}
              states={stateOptions}
              cities={cityOptions}
              localities={localityOptions}
              onFilterChange={setFilters}
            />
          </div>

          <div>
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

            {viewMode === 'grid' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
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
                          search: '',
                          listingType: 'all',
                          state: '',
                          city: '',
                          propertyTypes: [],
                          bedrooms: 'any',
                          constructionStatus: 'all',
                          postedBy: 'all',
                          minPrice: 0,
                          maxPrice: 50000000,
                          minArea: '',
                          maxArea: '',
                          localities: [],
                        })
                      }
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {viewMode === 'map' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] md:h-[700px] rounded-2xl overflow-hidden shadow-lg"
              >
                <MapView properties={listings} center={[28.6139, 77.2090]} zoom={5} />
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
