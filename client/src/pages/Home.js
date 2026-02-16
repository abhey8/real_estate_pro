import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { getAllStates, getCitiesByState, getAreasByCity } from '../utils/locations';
import ListingCard from '../components/ListingCard';
import './Home.css';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    propertyType: '',
    listingType: '',
    state: '',
    city: '',
    area: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [locations, setLocations] = useState({ cities: [], states: [] });
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLocations();
    loadListings();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const cities = getCitiesByState(selectedState);
      setAvailableCities(cities);
      setSelectedCity('');
      setFilters({ ...filters, state: selectedState, city: '', area: '' });
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity) {
      const areas = getAreasByCity(selectedCity);
      setAvailableAreas(areas);
      setFilters({ ...filters, city: selectedCity, area: '' });
    }
  }, [selectedCity]);

  const loadLocations = async () => {
    try {
      const response = await api.get('/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const loadListings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (search) {
        queryParams.append('search', search);
      }

      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      queryParams.append('status', 'ACTIVE');
      queryParams.append('limit', '100');

      const response = await api.get(`/listings?${queryParams}`);
      setListings(response.data.listings);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity('');
    setAvailableAreas([]);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
  };

  const handleAreaChange = (e) => {
    setFilters({
      ...filters,
      area: e.target.value,
    });
  };

  const handleApplyFilters = () => {
    loadListings();
  };

  const handleClearFilters = () => {
    setFilters({
      propertyType: '',
      listingType: '',
      state: '',
      city: '',
      area: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
    });
    setSelectedState('');
    setSelectedCity('');
    setAvailableCities([]);
    setAvailableAreas([]);
    setSearch('');
  };

  // Debounce filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadListings();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters.propertyType, filters.listingType, filters.minPrice, filters.maxPrice, filters.bedrooms]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadListings();
  };

  const allStates = getAllStates();

  return (
    <div className="home">
      <Helmet>
        <title>Find Your Dream Property | RealEstate Pro</title>
        <meta name="description" content="Browse premium residential and commercial properties for sale and rent. Search by location, type, and price." />
      </Helmet>

      {/* Hero Section */}
      <section className="hero">
        <div className="container animate-fade-in">
          <h1 className="hero-title">
            Find Your <span style={{ color: 'var(--accent-color)' }}>Perfect</span> Place
          </h1>
          <p className="hero-subtitle">
            Discover a place you'll love to live. Browse over 1,000+ properties in top locations.
          </p>

          <form onSubmit={handleSearchSubmit} className="hero-search-form">
            <input
              type="text"
              placeholder="Search by city, neighborhood, or address..."
              className="hero-search-input"
              value={search}
              onChange={handleSearchChange}
            />
            <button type="submit" className="hero-search-btn">
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="container main-content-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="sidebar-search">
            <label className="sidebar-search-label">Filter Properties</label>
          </div>

          <div className="filters-stack">
            <div className="filter-group">
              <label className="filter-label">Listing Type</label>
              <select
                name="listingType"
                className="select"
                value={filters.listingType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="BUY">Buy</option>
                <option value="RENT">Rent</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Property Type</label>
              <select
                name="propertyType"
                className="select"
                value={filters.propertyType}
                onChange={handleFilterChange}
              >
                <option value="">All Properties</option>
                <option value="APARTMENT">Apartment</option>
                <option value="HOUSE">House</option>
                <option value="VILLA">Villa</option>
                <option value="OFFICE">Office</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Price Range</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  className="input"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  className="input"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Bedrooms</label>
              <select
                name="bedrooms"
                className="select"
                value={filters.bedrooms}
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <button
              className="btn btn-secondary"
              onClick={handleClearFilters}
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Listings Grid */}
        <section className="listings-section">
          <div className="listings-header">
            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>
              {loading ? 'Loading...' : `${listings.length} Properties Found`}
            </h2>
          </div>

          {loading ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '4rem' }}>
              <p>Finding the best homes for you...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="no-results" style={{ textAlign: 'center', padding: '4rem' }}>
              <p>No properties found matching your criteria.</p>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map(listing => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
