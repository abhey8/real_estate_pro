import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ArrowRight, Bath, Bed, Building2, MapPinned, RefreshCw, Square, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import api from '../utils/api';
import { MapView } from '../new-src/app/components/MapView';
import { Button } from '../new-src/app/components/ui/button';
import { INDIA_CENTER, resolveListingCoordinates } from '../utils/locationMap';

interface MapListing {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  coordinates: [number, number];
}

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const FALLBACK_PROPERTY_IMAGE = '/property-placeholder.svg';

const formatPrice = (price: number, status: string) =>
  status === 'rent' ? `${INR_FORMATTER.format(price)}/month` : INR_FORMATTER.format(price);

const formatStatus = (status: string) => {
  if (status === 'rent') {
    return 'For Rent';
  }

  if (status === 'sell' || status === 'buy') {
    return 'For Sale';
  }

  return 'For Sale';
};

export default function MapViewPage() {
  const [listings, setListings] = useState<MapListing[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<MapListing | null>(null);
  const [loading, setLoading] = useState(true);

  const loadListings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/listings?status=ACTIVE&limit=100');
      const adaptedListings = (response.data.listings || []).map((listing: any) => ({
        id: listing._id || listing.id,
        title: listing.title,
        location: [listing.area || listing.address, listing.city, listing.state].filter(Boolean).join(', '),
        price: listing.price,
        status: listing.listingType?.toLowerCase() || 'buy',
        image: listing.images?.[0]?.url || FALLBACK_PROPERTY_IMAGE,
        bedrooms: listing.bedrooms || 0,
        bathrooms: listing.bathrooms || 0,
        area: listing.areaSqFt || 0,
        coordinates: resolveListingCoordinates(listing),
      }));

      setListings(adaptedListings);
      setSelectedProperty((current) => current || adaptedListings[0] || null);
    } catch (error) {
      console.error('Error loading properties for map view:', error);
      setListings([]);
      setSelectedProperty(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const highlightedProperty = selectedProperty || listings[0] || null;

  const mapStats = useMemo(() => {
    const rentCount = listings.filter((listing) => listing.status === 'rent').length;
    const saleCount = listings.length - rentCount;

    return { rentCount, saleCount };
  }, [listings]);

  return (
    <div className="min-h-screen bg-slate-950 pt-20 text-white md:pt-24">
      <Helmet>
        <title>Map Search | Real Estate Pro</title>
      </Helmet>

      <section className="px-4 pb-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_28%),linear-gradient(135deg,#020617,#0f172a_62%,#172554)] p-6 shadow-[0_28px_80px_rgba(2,6,23,0.45)] md:p-8"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">
                  <MapPinned className="h-4 w-4" />
                  Map Search
                </div>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Explore listings on a map that finally matches the product.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                  Markers now stay in India, fallback coordinates align with the listing city, and the map zooms into the market you are actually browsing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Active Listings</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{loading ? '...' : listings.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">For Sale</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{loading ? '...' : mapStats.saleCount}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadListings}
                  className="h-12 rounded-2xl border-white/10 bg-white/5 px-5 text-white shadow-none hover:bg-white/10"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Map
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Highlighted Marker</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {highlightedProperty ? highlightedProperty.title : 'Select a property'}
                  </h2>
                </div>
              </div>

              {highlightedProperty ? (
                <>
                  <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/70">
                    <img
                      src={highlightedProperty.image || FALLBACK_PROPERTY_IMAGE}
                      alt={highlightedProperty.title}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = FALLBACK_PROPERTY_IMAGE;
                      }}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                      {formatStatus(highlightedProperty.status)}
                    </span>
                    <span className="text-2xl font-semibold tracking-tight text-white">
                      {formatPrice(highlightedProperty.price, highlightedProperty.status)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{highlightedProperty.location}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4 text-slate-400" />
                      <span>{highlightedProperty.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-4 w-4 text-slate-400" />
                      <span>{highlightedProperty.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4 text-slate-400" />
                      <span>{highlightedProperty.area.toLocaleString()} sq.ft.</span>
                    </div>
                  </div>
                  <Link to={`/listings/${highlightedProperty.id}`} className="mt-6 inline-flex">
                    <Button className="h-11 rounded-xl bg-white px-4 text-slate-950 hover:bg-slate-100">
                      View Listing
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <p className="mt-5 text-sm leading-6 text-slate-300">
                  We will show the strongest match here as soon as listings load.
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <div className="border-b border-white/10 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Property List</p>
                    <h2 className="mt-1 text-lg font-semibold text-white">Jump to a marker</h2>
                  </div>
                  <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {loading ? 'Loading' : `${listings.length} total`}
                  </div>
                </div>
              </div>

              <div className="max-h-[520px] space-y-2 overflow-y-auto p-3">
                {listings.map((listing) => {
                  const selected = selectedProperty?.id === listing.id;
                  return (
                    <button
                      key={listing.id}
                      type="button"
                      onClick={() => setSelectedProperty(listing)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                        selected
                          ? 'border-amber-300/40 bg-amber-300/10 shadow-[0_16px_32px_rgba(251,191,36,0.08)]'
                          : 'border-white/10 bg-slate-900/50 hover:border-white/20 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{listing.title}</p>
                          <p className="mt-1 text-xs leading-5 text-slate-400">{listing.location}</p>
                        </div>
                        <span className="text-sm font-semibold text-white">{formatPrice(listing.price, listing.status)}</span>
                      </div>
                    </button>
                  );
                })}

                {!loading && listings.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 px-4 py-10 text-center text-sm text-slate-400">
                    No active listings are available to plot right now.
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 shadow-[0_28px_80px_rgba(2,6,23,0.38)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-300" />
                <span>
                  {highlightedProperty
                    ? `Focused on ${highlightedProperty.location}`
                    : 'Focused on the current active portfolio'}
                </span>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                India First
              </span>
            </div>
            <div className="h-[68vh] min-h-[520px] w-full">
              <MapView
                properties={listings}
                center={highlightedProperty?.coordinates || INDIA_CENTER}
                zoom={highlightedProperty ? 12 : 5}
                onMarkerClick={(property) => setSelectedProperty(property as MapListing)}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
