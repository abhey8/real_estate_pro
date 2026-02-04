import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

import ListingCard from '../components/ListingCard';
import './Recommendations.css';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

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

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="loading">
            <p>Loading recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1>Recommended Properties</h1>
          <p>Based on your preferences and favorites</p>
        </div>

        {recommendations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💡</div>
            <h2>No recommendations yet</h2>
            <p>Start adding properties to your favorites to get personalized recommendations!</p>
            <Link to="/" className="btn btn-primary">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="recommendations-grid">
            {recommendations.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export default Recommendations;

