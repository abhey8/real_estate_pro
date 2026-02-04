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
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadListings();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters.propertyType, filters.listingType, filters.minPrice, filters.maxPrice, filters.bedrooms, search]);

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
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Find Your Dream Property</h1>
          <p className="hero-subtitle">
            Buy, Sell, or Rent Commercial and Residential Properties
          </p>
          <form onSubmit={handleSearchSubmit} className="hero-search-form">
            <input
              type="text"
              placeholder="Search by city, state, or property name..."
              value={search}
              onChange={handleSearchChange}
              className="hero-search-input"
            />
            <button type="submit" className="btn btn-primary hero-search-btn">Search</button>
          </form>
        </div>
      </section>

      <div className="container">
        <div className="main-content-layout">
          {/* Sidebar Search & Filters */}
          <aside className="filters-sidebar">
            <div className="sidebar-search">
              <label className="sidebar-search-label">Search</label>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Keyword..."
                  value={search}
                  onChange={handleSearchChange}
                  className="input"
                />
              </form>
            </div>

            <div className="filters-stack">
              <div className="filter-group">
                <label>Listing Type</label>
                <select
                  name="listingType"
                  value={filters.listingType}
                  onChange={handleFilterChange}
                  className="input"
                >
                  <option value="">All Types</option>
                  <option value="BUY">Buy</option>
                  <option value="SELL">Sell</option>
                  <option value="RENT">Rent</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Property Type</label>
                <select
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                  className="input"
                >
                  <option value="">All Properties</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="VILLA">Villa</option>
                  <option value="CONDOMINIUM">Condominium</option>
                  <option value="TOWNHOUSE">Townhouse</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="OFFICE">Office</option>
                  <option value="RETAIL">Retail</option>
                  <option value="LAND">Land</option>
                </select>
              </div>

              <div className="filter-group">
                <label>State</label>
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  className="input"
                >
                  <option value="">Select State</option>
                  {allStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>City</label>
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="input"
                  disabled={!selectedState}
                >
                  <option value="">Select City</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {availableAreas.length > 0 && (
                <div className="filter-group">
                  <label>Area/Locality</label>
                  <select
                    name="area"
                    value={filters.area}
                    onChange={handleAreaChange}
                    className="input"
                  >
                    <option value="">All Areas</option>
                    {availableAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="filter-group">
                <label>Min Price (₹)</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="input"
                />
              </div>

              <div className="filter-group">
                <label>Max Price (₹)</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="input"
                />
              </div>

              <div className="filter-group">
                <label>Bedrooms</label>
                <select
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                  className="input"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="filter-actions">
                <button onClick={handleApplyFilters} className="btn btn-primary" style={{ width: '100%' }}>
                  Apply Filters
                </button>
                <button onClick={handleClearFilters} className="btn btn-secondary" style={{ width: '100%' }}>
                  Clear All
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="listings-section">
            <div className="listings-header">
              <h2>{listings.length} Properties Found</h2>
            </div>

            {loading ? (
              <div className="loading">
                <p>Loading properties...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="no-results">
                <p>No properties found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="listings-grid">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};


export default Home;
