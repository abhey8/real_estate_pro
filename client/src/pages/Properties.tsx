import React, { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, Map } from 'lucide-react';
import { PropertyCard } from '../new-src/app/components/PropertyCard';
import { PropertyFilters, FilterState } from '../new-src/app/components/PropertyFilters';
import { MapView } from '../new-src/app/components/MapView';
import { Button } from '../new-src/app/components/ui/button';
import { getAllStates, getCitiesByState } from '../utils/locations';
import { getMapFocusFromFilters, resolveListingCoordinates } from '../utils/locationMap';
import api from '../utils/api';
import './Home.css';

const CHANDIGARH_LOCALITIES = [
  { name: 'Zirakpur', rating: 4.3 },
  { name: 'Mullanpur', rating: 3.9 },
  { name: 'Dera Bassi', rating: 3.8 },
  { name: 'New Chandigarh', rating: 4.4 },
  { name: 'Kharar', rating: 4.0 },
];

const DEFAULT_FILTERS: FilterState = {
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
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Residential Apartment',
  HOUSE: 'Independent House/Villa',
  LAND: 'Residential Land',
  FLOOR: 'Builder Floor',
  STUDIO: 'Studio Apartment',
  PENTHOUSE: 'Penthouse',
};

const LISTING_TYPE_LABELS: Record<string, string> = {
  BUY: 'Buy',
  SELL: 'Sell',
  RENT: 'Rent',
};

const CONSTRUCTION_LABELS: Record<string, string> = {
  new_launch: 'New Launch',
  under_construction: 'Under Construction',
  ready_to_move: 'Ready to Move',
};

const POSTED_BY_LABELS: Record<string, string> = {
  owner: 'Owner',
  builder: 'Builder',
  dealer: 'Dealer',
  feature_dealer: 'Feature Dealer',
};

const unique = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));

const normalize = (value: string) => value.trim().toLowerCase();

export default function Properties() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [remoteStates, setRemoteStates] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const deferredSearch = useDeferredValue(filters.search);

  const selectedPropertyTypes = filters.propertyTypes.join('|');
  const selectedLocalities = filters.localities.join('|');
  const remoteStateKey = remoteStates.join('|');

  const stateOptions = useMemo(() => unique([...getAllStates(), ...remoteStates]), [remoteStates]);

  const cityOptions = useMemo(() => {
    if (!filters.state) {
      return [];
    }
    return unique(getCitiesByState(filters.state));
  }, [filters.state]);

  const localityOptions = useMemo(() => {
    const cityText = `${filters.city} ${filters.search}`.toLowerCase();
    if (!cityText) {
      return [];
    }

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

  const mapFocus = useMemo(
    () => getMapFocusFromFilters({ search: filters.search, city: filters.city, state: filters.state }),
    [filters.city, filters.search, filters.state]
  );

  const activeFilterTags = useMemo(() => {
    const tags: string[] = [];

    if (filters.search.trim()) {
      tags.push(`"${filters.search.trim()}"`);
    }

    if (filters.listingType !== 'all') {
      tags.push(LISTING_TYPE_LABELS[filters.listingType] || filters.listingType);
    }

    if (filters.state) {
      tags.push(filters.state);
    }

    if (filters.city) {
      tags.push(filters.city);
    }

    if (filters.propertyTypes.length === 1) {
      tags.push(PROPERTY_TYPE_LABELS[filters.propertyTypes[0]] || 'Property Type');
    } else if (filters.propertyTypes.length > 1) {
      tags.push(`${filters.propertyTypes.length} property types`);
    }

    if (filters.bedrooms !== 'any') {
      tags.push(`${filters.bedrooms}+ BHK`);
    }

    if (filters.constructionStatus !== 'all') {
      tags.push(CONSTRUCTION_LABELS[filters.constructionStatus] || filters.constructionStatus);
    }

    if (filters.postedBy !== 'all') {
      tags.push(POSTED_BY_LABELS[filters.postedBy] || filters.postedBy);
    }

    if (filters.minPrice > 0 || filters.maxPrice < DEFAULT_FILTERS.maxPrice) {
      tags.push('Custom budget');
    }

    if (filters.minArea || filters.maxArea) {
      tags.push('Custom area');
    }

    if (filters.localities.length > 0) {
      tags.push(...filters.localities);
    }

    return tags;
  }, [
    filters.search,
    filters.listingType,
    filters.state,
    filters.city,
    filters.propertyTypes,
    filters.bedrooms,
    filters.constructionStatus,
    filters.postedBy,
    filters.minPrice,
    filters.maxPrice,
    filters.minArea,
    filters.maxArea,
    filters.localities,
  ]);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await api.get('/listings/locations');
        setRemoteStates(response.data?.states || []);
      } catch (error) {
        console.error('Error loading location options:', error);
      }
    };

    loadLocations();
  }, []);

  useEffect(() => {
    loadListings({ ...filters, search: deferredSearch.trim() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deferredSearch,
    filters.listingType,
    filters.state,
    filters.city,
    selectedPropertyTypes,
    filters.bedrooms,
    filters.constructionStatus,
    filters.postedBy,
    filters.minPrice,
    filters.maxPrice,
    filters.minArea,
    filters.maxArea,
    selectedLocalities,
    remoteStateKey,
  ]);

  const handleFilterChange = (nextFilters: FilterState) => {
    startTransition(() => {
      setFilters(nextFilters);
    });
  };

  const resetFilters = () => {
    handleFilterChange({ ...DEFAULT_FILTERS });
  };

  const loadListings = async (currentFilters: FilterState) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (currentFilters.search) {
        queryParams.append('search', currentFilters.search);
      }

      if (currentFilters.listingType !== 'all') {
        queryParams.append('listingType', currentFilters.listingType);
      }

      if (currentFilters.propertyTypes.length > 0) {
        queryParams.append('propertyType', currentFilters.propertyTypes.join(','));
      }

      const canServerFilterByState =
        !!currentFilters.state &&
        remoteStates.some((state) => normalize(state) === normalize(currentFilters.state));

      if (canServerFilterByState) {
        queryParams.append('state', currentFilters.state);
      }

      if (currentFilters.city) {
        queryParams.append('city', currentFilters.city);
      }

      if (currentFilters.localities.length > 0) {
        queryParams.append('locality', currentFilters.localities.join(','));
      }

      if (currentFilters.bedrooms !== 'any') {
        queryParams.append('bedrooms', parseInt(currentFilters.bedrooms, 10).toString());
      }

      if (currentFilters.minPrice > 0) {
        queryParams.append('minPrice', currentFilters.minPrice.toString());
      }

      if (currentFilters.maxPrice < DEFAULT_FILTERS.maxPrice) {
        queryParams.append('maxPrice', currentFilters.maxPrice.toString());
      }

      if (currentFilters.minArea) {
        queryParams.append('minArea', currentFilters.minArea);
      }

      if (currentFilters.maxArea) {
        queryParams.append('maxArea', currentFilters.maxArea);
      }

      if (currentFilters.constructionStatus !== 'all') {
        queryParams.append('constructionStatus', currentFilters.constructionStatus);
      }

      if (currentFilters.postedBy !== 'all') {
        queryParams.append('postedBy', currentFilters.postedBy);
      }

      queryParams.append('status', 'ACTIVE');
      queryParams.append('limit', '100');

      const response = await api.get(`/listings?${queryParams.toString()}`);
      let apiListings = response.data.listings || [];

      if (currentFilters.state && !canServerFilterByState) {
        const allowedCities = new Set(getCitiesByState(currentFilters.state).map((city) => normalize(city)));
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
        image: listing.images?.[0]?.url || '/property-placeholder.svg',
        bedrooms: listing.bedrooms || 0,
        bathrooms: listing.bathrooms || 0,
        area: listing.areaSqFt || 0,
        coordinates: resolveListingCoordinates(listing),
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
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-24">
      <section className="bg-black px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.32em] text-white/50">Real Estate Pro</p>
            <h1 className="text-4xl tracking-tight md:text-6xl">Search Properties</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75 md:text-xl">
              Explore listings with cleaner controls, clearer results, and location-first filtering that feels easier to scan.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 lg:grid-cols-[340px_minmax(0,1fr)] xl:gap-10">
          <div className="lg:sticky lg:top-28">
            <PropertyFilters
              filters={filters}
              states={stateOptions}
              cities={cityOptions}
              localities={localityOptions}
              activeFilterCount={activeFilterTags.length}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Property Search</p>
                  <div className="mt-2 flex flex-wrap items-end gap-2">
                    <span className="text-3xl font-semibold tracking-tight text-slate-900">
                      {loading ? '...' : listings.length}
                    </span>
                    <span className="pb-1 text-sm text-slate-500">
                      {listings.length === 1 ? 'property matched' : 'properties matched'}
                    </span>
                  </div>

                  {activeFilterTags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {activeFilterTags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                      {activeFilterTags.length > 5 && (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-500">
                          +{activeFilterTags.length - 5} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">
                      Use the left panel to narrow the catalog by city, budget, area, or property type.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1.5">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={
                      viewMode === 'grid'
                        ? 'rounded-xl bg-slate-900 px-4 text-white hover:bg-slate-800'
                        : 'rounded-xl bg-transparent px-4 text-slate-600 hover:bg-white'
                    }
                  >
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className={
                      viewMode === 'map'
                        ? 'rounded-xl bg-slate-900 px-4 text-white hover:bg-slate-800'
                        : 'rounded-xl bg-transparent px-4 text-slate-600 hover:bg-white'
                    }
                  >
                    <Map className="mr-2 h-4 w-4" />
                    Map
                  </Button>
                </div>
              </div>
            </div>

            {viewMode === 'grid' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
              >
                {loading ? (
                  <div className="col-span-full rounded-[28px] border border-dashed border-slate-300 bg-white py-24 text-center text-lg font-light text-slate-500">
                    Loading properties...
                  </div>
                ) : listings.length > 0 ? (
                  listings.map((property, index) => (
                    <PropertyCard key={property.id} property={property} index={index} />
                  ))
                ) : (
                  <div className="col-span-full rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                    <p className="text-2xl font-semibold tracking-tight text-slate-900">No properties match your filters</p>
                    <p className="mt-3 text-sm text-slate-500">
                      Reset the filter stack and start again with a broader search.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6 rounded-xl border-slate-200 bg-white px-4 text-slate-700 shadow-none hover:bg-slate-100"
                      onClick={resetFilters}
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
                className="h-[600px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:h-[700px]"
              >
                <MapView properties={listings} center={mapFocus.center} zoom={mapFocus.zoom} />
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
